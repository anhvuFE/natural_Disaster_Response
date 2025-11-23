import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDisasterStore } from "@/store/disasterStore";
import { useToast } from "@/components/ui/use-toast";
import type { ChecklistItem, DisasterGuide, TipsSection } from "@/types";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function AdminContentPage() {
  const { provinceId = "", disasterCode = "" } = useParams<{ provinceId: string; disasterCode: string }>();
  const { toast } = useToast();
  const token = useAuthStore((s) => s.token);
  const { getGuide } = useDisasterStore();
  const [guide, setGuide] = useState<DisasterGuide | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getGuide(provinceId, disasterCode)
      .then(setGuide)
      .catch(() => toast({ title: "Không tải được nội dung", variant: "destructive" }));
  }, [disasterCode, getGuide, provinceId, toast]);

  const updateChecklist = (updater: (items: ChecklistItem[]) => ChecklistItem[]) => {
    setGuide((prev) => (prev ? { ...prev, before: updater(prev.before) } : prev));
  };

  const updateTips = (
    key: "during" | "after",
    updater: (sections: TipsSection[]) => TipsSection[]
  ) => {
    setGuide((prev) => (prev ? { ...prev, [key]: updater(prev[key]) } : prev));
  };

  const handleSave = async () => {
    if (!guide) return;
    setSaving(true);
    try {
      await Api.updateDisasterGuide(provinceId, disasterCode, guide, token);
      toast({ title: "Đã lưu nội dung" });
    } catch (err) {
      toast({ title: "Lỗi lưu nội dung", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!guide) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Đang tải nội dung...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">Nội dung hướng dẫn</p>
        <h1 className="text-2xl font-bold leading-tight">Soạn checklist & lời khuyên cho người dân</h1>
        <p className="text-sm text-sky-100">
          Tỉnh: {guide.provinceId} • Thiên tai: {guide.disasterCode}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={saving} className="bg-white text-slate-900 hover:bg-slate-100">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Lưu thay đổi
          </Button>
          <Link to={`/province/${guide.provinceId}`} className="text-sm text-sky-100 underline underline-offset-4">
            Xem trước như người dân
          </Link>
        </div>
      </div>

      <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
        <CardHeader>
          <CardTitle>Checklist trước khi xảy ra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {guide.before.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3">
              <Input
                className="w-16"
                type="number"
                value={item.order}
                onChange={(e) =>
                  updateChecklist((items) =>
                    items.map((it, idx) => (idx === index ? { ...it, order: Number(e.target.value) } : it))
                  )
                }
              />
              <Input
                className="flex-1"
                value={item.text}
                onChange={(e) =>
                  updateChecklist((items) =>
                    items.map((it, idx) => (idx === index ? { ...it, text: e.target.value } : it))
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => updateChecklist((items) => items.filter((_, idx) => idx !== index))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              updateChecklist((items) => [
                ...items,
                { id: crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`, order: items.length + 1, text: "" },
              ])
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm mục checklist
          </Button>
        </CardContent>
      </Card>

      <TipsEditor
        title="Trong lúc xảy ra"
        sections={guide.during}
        onChange={(sections) => updateTips("during", () => sections)}
      />
      <TipsEditor
        title="Sau thiên tai"
        sections={guide.after}
        onChange={(sections) => updateTips("after", () => sections)}
      />
    </div>
  );
}

function TipsEditor({
  title,
  sections,
  onChange,
}: {
  title: string;
  sections: TipsSection[];
  onChange: (sections: TipsSection[]) => void;
}) {
  const updateSection = (idx: number, updater: (section: TipsSection) => TipsSection) => {
    onChange(sections.map((s, i) => (i === idx ? updater(s) : s)));
  };

  return (
    <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Input
                value={section.title}
                onChange={(e) => updateSection(index, (s) => ({ ...s, title: e.target.value }))}
                placeholder="Tiêu đề"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange(sections.filter((_, idx) => idx !== index))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <Textarea
              value={section.bullets.join("\n")}
              onChange={(e) => updateSection(index, (s) => ({ ...s, bullets: e.target.value.split("\n").filter(Boolean) }))}
              placeholder="Mỗi dòng là một gợi ý"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onChange([
              ...sections,
              {
                id: crypto.randomUUID ? crypto.randomUUID() : `section-${Date.now()}`,
                title: "",
                bullets: [],
              },
            ])
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm section
        </Button>
      </CardContent>
    </Card>
  );
}
