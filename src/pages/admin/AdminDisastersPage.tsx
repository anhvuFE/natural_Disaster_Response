import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Api } from "@/lib/api";
import { useDisasterStore } from "@/store/disasterStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import type { DisasterType } from "@/types";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

const empty: DisasterType = { code: "", name: "", icon: "" };

export default function AdminDisastersPage() {
  const token = useAuthStore((s) => s.token);
  const { disasterTypes, fetchDisasterTypes } = useDisasterStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState<DisasterType>(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDisasterTypes().catch(() => toast({ title: "Không tải được danh sách thiên tai", variant: "destructive" }));
  }, [fetchDisasterTypes, toast]);

  const resetForm = () => setEditing(empty);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!editing.code.trim() || !editing.name.trim()) throw new Error("Code và tên bắt buộc");
      if (disasterTypes.find((d) => d.code === editing.code)) {
        await Api.updateDisasterType(editing.code, editing, token);
        toast({ title: "Đã cập nhật loại thiên tai" });
      } else {
        await Api.createDisasterType(editing, token);
        toast({ title: "Đã tạo loại thiên tai" });
      }
      resetForm();
      fetchDisasterTypes();
    } catch (err) {
      toast({ title: "Lỗi lưu", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (code: string) => {
    setLoading(true);
    try {
      await Api.deleteDisasterType(code, token);
      toast({ title: "Đã xóa" });
      fetchDisasterTypes();
    } catch (err) {
      toast({ title: "Lỗi xóa", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-800 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Loại thiên tai</p>
        <h1 className="text-2xl font-bold leading-tight">Chuẩn hóa danh mục thiên tai</h1>
        <p className="text-sm text-cyan-50">Code và biểu tượng sẽ hiển thị ở tab thiên tai cho người dân.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{editing.code ? "Sửa loại thiên tai" : "Thêm loại thiên tai"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input label="Code" placeholder="flood" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
              <Input label="Tên hiển thị" placeholder="Lũ lụt" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input label="Biểu tượng" placeholder="🌊 (tùy chọn)" value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} hint="Có thể dùng emoji hoặc ký hiệu ngắn" />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Lưu danh mục
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>Danh sách loại thiên tai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {disasterTypes.map((d) => (
              <div key={d.code} className="flex items-start justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span className="text-lg">{d.icon || "🌐"}</span>
                    {d.name}
                  </div>
                  <div className="text-xs text-slate-600">Code: {d.code}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => setEditing(d)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(d.code)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {disasterTypes.length === 0 && <p className="text-sm text-slate-600">Chưa có loại thiên tai.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
