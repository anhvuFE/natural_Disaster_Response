import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";

const demoUser = {
  token: "demo-token",
  user: {
    id: "demo-user",
    name: "Cán bộ Demo",
    role: "local_admin" as const,
    provinceIds: ["minh-hoa"],
  },
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const loginStore = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Api.login(email, password);
      loginStore(res.token, res.user as any);
      toast({ title: "Đăng nhập thành công" });
      navigate("/admin");
    } catch (err) {
      toast({ title: "Đăng nhập thất bại", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-3 py-10 md:flex-row md:px-6">
        <div className="order-2 flex-1 space-y-4 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-900/8 md:order-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
            <ShieldCheck className="h-4 w-4" /> Kênh cán bộ
          </div>
          <h1 className="text-3xl font-bold leading-tight">Quản trị nội dung & cảnh báo</h1>
          <p className="text-sm text-slate-600">
            Cập nhật checklist, nơi trú ẩn, số khẩn cấp và gửi cảnh báo đến người dân. Dùng tài khoản demo nếu chưa có thông tin chính thức.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Chưa có tài khoản?</p>
            <p>Liên hệ quản trị để được cấp email và mật khẩu.</p>
          </div>
        </div>

        <Card className="order-1 w-full flex-1 border-slate-200 bg-white shadow-lg shadow-slate-900/10 md:order-2">
          <CardHeader>
            <CardTitle>Đăng nhập Admin</CardTitle>
            <CardDescription>Nhập email và mật khẩu do quản trị cấp hoặc dùng tài khoản demo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input type="email" placeholder="you@domain.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
                <Input type="password" placeholder="••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Đăng nhập
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
