import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDisasterStore } from "@/store/disasterStore";
import { useAuthStore } from "@/store/authStore";
import { Api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import type { EmergencyContact } from "@/types";
import { Loader2, PhoneCall, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/modal";

const emptyContact: EmergencyContact = { id: "", name: "", phone: "", category: "", note: "" };

export default function AdminContactsPage() {
  const { provinceId = "" } = useParams<{ provinceId: string }>();
  const token = useAuthStore((s) => s.token);
  const { getContacts, setContacts } = useDisasterStore();
  const { toast } = useToast();
  const [contacts, setContactsState] = useState<EmergencyContact[]>([]);
  const [editing, setEditing] = useState<EmergencyContact>(emptyContact);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<EmergencyContact | null>(null);

  useEffect(() => {
    getContacts(provinceId)
      .then(setContactsState)
      .catch(() => toast({ title: "Không tải được danh bạ", variant: "destructive" }));
  }, [getContacts, provinceId, toast]);

  const resetForm = () => setEditing(emptyContact);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!editing.name.trim() || !editing.phone.trim()) throw new Error("Tên và số điện thoại bắt buộc");
      if (editing.id) {
        const updated = await Api.updateContact(provinceId, editing.id, editing, token);
        const next = contacts.map((c) => (c.id === updated.id ? updated : c));
        setContactsState(next);
        setContacts(provinceId, next);
        toast({ title: "Đã cập nhật" });
      } else {
        const created = await Api.createContact(provinceId, editing, token);
        const next = [...contacts, created];
        setContactsState(next);
        setContacts(provinceId, next);
        toast({ title: "Đã thêm" });
      }
      resetForm();
    } catch (err) {
      toast({ title: "Lỗi lưu", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    try {
      await Api.deleteContact(provinceId, id, token);
      const next = contacts.filter((c) => c.id !== id);
      setContactsState(next);
      setContacts(provinceId, next);
      toast({ title: "Đã xóa" });
    } catch (err) {
      toast({ title: "Lỗi xóa", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-800 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-100">Số khẩn cấp</p>
        <h1 className="text-2xl font-bold leading-tight">Danh bạ gọi nhanh cho người dân</h1>
        <p className="text-sm text-amber-50">Nhập rõ nhóm (cứu hộ, y tế, điện lực...) để hiển thị đẹp ở trang công khai.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{editing.id ? "Sửa liên hệ" : "Thêm liên hệ"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input label="Tên đơn vị / cá nhân" placeholder="Trung tâm cứu hộ" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input
                label="Số điện thoại"
                placeholder="Nhấn để gọi nhanh"
                value={editing.phone}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              />
              <Input
                label="Nhóm"
                placeholder="Cứu hộ, Công an, Y tế..."
                value={editing.category || ""}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              />
              <Textarea
                placeholder="Ghi chú thêm (giờ làm việc, khu vực...)"
                value={editing.note || ""}
                onChange={(e) => setEditing({ ...editing, note: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing.id ? "Lưu thay đổi" : "Thêm liên hệ"}
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
            <CardTitle>Danh sách liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <PhoneCall className="h-4 w-4 text-brand-600" />
                    {contact.name}
                  </div>
                  <div className="text-sm text-slate-700">{contact.phone}</div>
                  {contact.category && <div className="text-xs text-slate-500">Nhóm: {contact.category}</div>}
                  {contact.note && <div className="text-xs text-slate-500">{contact.note}</div>}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => setEditing(contact)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(contact)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-sm text-slate-600">Chưa có liên hệ.</p>}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Xóa liên hệ?"
        description={`Bạn chắc chắn muốn xóa "${confirmDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={() => confirmDelete && onDelete(confirmDelete.id)}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
}
