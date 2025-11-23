import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProvinceStore } from "@/store/provinceStore";
import { Api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import type { Province } from "@/types";
import { Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/modal";

const emptyProvince: Province = { id: "", name: "", slug: "", region: "", defaultDisasterCode: "" };

export default function AdminProvincesPage() {
  const token = useAuthStore((s) => s.token);
  const { provinces, fetchProvinces, error, loading } = useProvinceStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Province>(emptyProvince);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Province | null>(null);

  useEffect(() => {
    fetchProvinces().catch(() => toast({ title: "Không tải được danh sách tỉnh", variant: "destructive" }));
  }, [fetchProvinces, toast]);

  const resetForm = () => setEditing(emptyProvince);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!editing.name.trim() || !editing.slug.trim()) throw new Error("Tên và slug bắt buộc");
      if (editing.id) {
        await Api.updateProvince(editing.id, editing, token);
        toast({ title: "Đã cập nhật tỉnh" });
      } else {
        await Api.createProvince(editing, token);
        toast({ title: "Đã tạo tỉnh" });
      }
      resetForm();
      fetchProvinces();
    } catch (err) {
      toast({ title: "Lỗi lưu", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    setSaving(true);
    try {
      await Api.deleteProvince(id, token);
      toast({ title: "Đã xóa" });
      fetchProvinces();
    } catch (err) {
      toast({ title: "Lỗi xóa", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-800 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-100">Danh sách tỉnh/thành</p>
        <h1 className="text-2xl font-bold leading-tight">Quản lý địa bàn và mã truy cập</h1>
        <p className="text-sm text-indigo-50">Cập nhật tên, vùng và mã truy cập (slug) để người dân tìm đúng địa phương của mình.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{editing.id ? "Sửa tỉnh/thành" : "Thêm tỉnh/thành"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input label="Tên" placeholder="Hà Nội" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input label="Slug" placeholder="ha-noi" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} hint="Dùng chữ thường, gạch nối, không dấu" />
              <Input label="Vùng" placeholder="Đồng bằng sông Hồng" value={editing.region || ""} onChange={(e) => setEditing({ ...editing, region: e.target.value })} />
              <Input
                label="Thiên tai mặc định"
                placeholder="flood"
                value={editing.defaultDisasterCode || ""}
                onChange={(e) => setEditing({ ...editing, defaultDisasterCode: e.target.value })}
                hint="Code của loại thiên tai phổ biến nhất"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="w-full">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing.id ? "Lưu thay đổi" : "Thêm tỉnh"}
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
            <CardTitle>Danh sách tỉnh/thành</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <span>
                {loading
                  ? "Đang tải danh sách tỉnh từ AddressKit..."
                  : error
                  ? `Nguồn dữ liệu: ${error}`
                  : "Nguồn dữ liệu: AddressKit"}
              </span>
              <Button size="sm" variant="outline" onClick={() => fetchProvinces()} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}Tải lại
              </Button>
            </div>
            {provinces.map((province) => (
              <div key={province.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    {province.name}
                  </div>
                  <div className="text-xs text-slate-600">Slug: {province.slug}</div>
                  {province.region && <div className="text-xs text-slate-500">Vùng: {province.region}</div>}
                  {province.defaultDisasterCode && (
                    <div className="text-xs text-slate-500">Thiên tai mặc định: {province.defaultDisasterCode}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => setEditing(province)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(province)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {provinces.length === 0 && <p className="text-sm text-slate-600">Chưa có tỉnh.</p>}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Xóa tỉnh/thành?"
        description={`Bạn chắc chắn muốn xóa "${confirmDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={() => confirmDelete && onDelete(confirmDelete.id)}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
}
