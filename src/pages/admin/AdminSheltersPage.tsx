import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDisasterStore } from "@/store/disasterStore";
import { Api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import type { Shelter } from "@/types";
import { Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/modal";

const emptyShelter: Shelter = {
  id: "",
  name: "",
  address: "",
  lat: 0,
  lng: 0,
  status: "active",
  note: "",
  phone: "",
  hours: "",
};

export default function AdminSheltersPage() {
  const { provinceId = "" } = useParams<{ provinceId: string }>();
  const token = useAuthStore((s) => s.token);
  const { getShelters, setShelters } = useDisasterStore();
  const { toast } = useToast();
  const [shelters, setSheltersState] = useState<Shelter[]>([]);
  const [editing, setEditing] = useState<Shelter>(emptyShelter);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Shelter | null>(null);

  useEffect(() => {
    getShelters(provinceId)
      .then(setSheltersState)
      .catch(() => toast({ title: "Không tải được nơi trú ẩn", variant: "destructive" }));
  }, [getShelters, provinceId, toast]);

  const resetForm = () => setEditing(emptyShelter);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!editing.name.trim()) throw new Error("Tên bắt buộc");
      if (editing.id) {
        const updated = await Api.updateShelter(provinceId, editing.id, editing, token);
        const next = shelters.map((s) => (s.id === updated.id ? updated : s));
        setSheltersState(next);
        setShelters(provinceId, next);
        toast({ title: "Đã cập nhật nơi trú ẩn" });
      } else {
        const created = await Api.createShelter(provinceId, editing, token);
        const next = [...shelters, created];
        setSheltersState(next);
        setShelters(provinceId, next);
        toast({ title: "Đã thêm nơi trú ẩn" });
      }
      resetForm();
    } catch (err) {
      toast({ title: "Lỗi lưu nơi trú ẩn", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await Api.deleteShelter(provinceId, id, token);
      const next = shelters.filter((s) => s.id !== id);
      setSheltersState(next);
      setShelters(provinceId, next);
      toast({ title: "Đã xóa" });
    } catch (err) {
      toast({ title: "Lỗi xóa", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100">Nơi trú ẩn</p>
        <h1 className="text-2xl font-bold leading-tight">Quản lý địa điểm an toàn cho người dân</h1>
        <p className="text-sm text-emerald-50">Thêm/sửa tọa độ, số điện thoại và ghi chú vận hành.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{editing.id ? "Sửa nơi trú ẩn" : "Thêm nơi trú ẩn"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input label="Tên địa điểm" placeholder="Trường THCS..." value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input
                label="Địa chỉ"
                placeholder="Số nhà, phường, quận..."
                value={editing.address}
                onChange={(e) => setEditing({ ...editing, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Vĩ độ (lat)"
                  type="number"
                  step="0.0001"
                  placeholder="16.047"
                  value={editing.lat}
                  onChange={(e) => setEditing({ ...editing, lat: Number(e.target.value) })}
                />
                <Input
                  label="Kinh độ (lng)"
                  type="number"
                  step="0.0001"
                  placeholder="108.206"
                  value={editing.lng}
                  onChange={(e) => setEditing({ ...editing, lng: Number(e.target.value) })}
                />
              </div>
              <Input
                label="Điện thoại liên hệ"
                placeholder="0123 456 789"
                value={editing.phone || ""}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              />
              <Input
                label="Giờ hoạt động"
                placeholder="24/7 hoặc khung giờ"
                value={editing.hours || ""}
                onChange={(e) => setEditing({ ...editing, hours: e.target.value })}
              />
              <Textarea
                placeholder="Ghi chú thêm (sức chứa, lưu ý...)"
                value={editing.note || ""}
                onChange={(e) => setEditing({ ...editing, note: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing.id ? "Lưu thay đổi" : "Thêm địa điểm"}
                </Button>
                {editing.id && (
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Hủy
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>Danh sách nơi trú ẩn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shelters.map((shelter) => (
              <div key={shelter.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    {shelter.name}
                  </div>
                  <p className="text-sm text-slate-600">{shelter.address}</p>
                  <div className="text-xs text-slate-500">Lat: {shelter.lat} | Lng: {shelter.lng}</div>
                  {shelter.phone && <div className="text-xs text-slate-500">ĐT: {shelter.phone}</div>}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => setEditing(shelter)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(shelter)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {shelters.length === 0 && <p className="text-sm text-slate-600">Chưa có nơi trú ẩn.</p>}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Xóa nơi trú ẩn?"
        description={`Bạn chắc chắn muốn xóa "${confirmDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={() => confirmDelete && onDelete(confirmDelete.id)}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
}
