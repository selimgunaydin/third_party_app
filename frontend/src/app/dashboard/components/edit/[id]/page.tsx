"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import Preview from "@/components/Preview";
import { useComponent, useUpdateComponent, useConvertTailwind } from "@/hooks/queries";
import { Component } from "@/types";

export default function EditComponent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: component, isLoading: isLoadingComponent } = useComponent(params.id);
  const updateComponent = useUpdateComponent();
  const convertTailwindMutation = useConvertTailwind();

  const [name, setName] = useState("");
  const [selector, setSelector] = useState("");
  const [position, setPosition] = useState<"before" | "after">("after");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [javascript, setJavascript] = useState("");
  const [previewContent, setPreviewContent] = useState({
    html: "",
    css: "",
    javascript: "",
  });

  useEffect(() => {
    if (component) {
      setName(component.name);
      setSelector(component.selector);
      setPosition(component.position);
      setHtml(component.html);
      setCss(component.css);
      setJavascript(component.javascript);
      setPreviewContent({
        html: component.html,
        css: component.css,
        javascript: component.javascript,
      });
    }
  }, [component]);

  // Preview içeriğini güncellemek için useEffect
  useEffect(() => {
    setPreviewContent({
      html: html,
      css: css,
      javascript: javascript,
    });
  }, [html, css, javascript]);

  const convertTailwindToCSS = async (html: string) => {
    try {
      const result = await convertTailwindMutation.mutateAsync(html);
      setCss(result);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to convert TailwindCSS");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateComponent.mutateAsync({
        id: params.id,
        data: {
          name,
          selector,
          position,
          html,
          css,
          javascript,
        }
      });

      toast.success("Component updated successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update component");
    }
  };

  if (isLoadingComponent || !component) {
    return (
      <div className="p-6">
        <Card>
          <CardBody>
            <p className="text-center">Loading...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Component</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Component Name</h3>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter component name"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">CSS Selector</h3>
                <Input
                  value={selector}
                  onChange={(e) => setSelector(e.target.value)}
                  placeholder="Enter CSS selector (e.g. #header)"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Position</h3>
                <Select
                  value={position}
                  onChange={(e) =>
                    setPosition(e.target.value as "before" | "after")
                  }
                  selectedKeys={[position]}
                  required
                >
                  <SelectItem key="before" value="before">
                    Before
                  </SelectItem>
                  <SelectItem key="after" value="after">
                    After
                  </SelectItem>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">HTML</h3>
                <div className="mb-2">
                  <Button
                    type="button"
                    onPress={() => convertTailwindToCSS(previewContent.html)}
                    isLoading={convertTailwindMutation.isPending}
                    className="form-checkbox"
                  >
                    Convert TailwindCSS
                  </Button>
                </div>
                <Editor
                  height="200px"
                  defaultLanguage="html"
                  value={html}
                  onChange={(value) => setHtml(value || "")}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">CSS</h3>
                <Editor
                  height="200px"
                  defaultLanguage="css"
                  value={css}
                  onChange={(value) => setCss(value || "")}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">JavaScript</h3>
                <Editor
                  height="200px"
                  defaultLanguage="javascript"
                  value={javascript}
                  onChange={(value) => setJavascript(value || "")}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" color="primary" isLoading={updateComponent.isPending}>
                  Save
                </Button>
                <Button
                  variant="bordered"
                  onPress={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <Preview content={previewContent} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
