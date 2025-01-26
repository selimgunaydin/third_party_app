"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import { defaultComponents } from "@/data/defaultComponents";
import toast from "react-hot-toast";
import Preview from "@/components/Preview";
import { useCreateComponent, useConvertTailwind } from "@/hooks/queries";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { componentSchema } from "@/lib/validations";
import type { Component } from "@/types";

type ComponentFormData = Omit<
  Component,
  "_id" | "userId" | "createdAt" | "updatedAt"
>;

function NewComponentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createComponent = useCreateComponent();
  const convertTailwindMutation = useConvertTailwind();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [previewContent, setPreviewContent] = useState({
    html: "",
    css: "",
    javascript: "",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<ComponentFormData>({
    resolver: yupResolver(componentSchema),
    defaultValues: {
      position: "after",
      isActive: true,
      css: "",
      javascript: "",
      html: "",
      name: "",
      selector: "",
    },
  });

  useEffect(() => {
    // Get template parameter from URL
    const templateId = searchParams.get("template");
    if (templateId) {
      // Find selected template from default components
      const template = defaultComponents.find((c) => c.id === templateId);
      if (template) {
        setValue("name", template.name);
        setValue("selector", "");
        setValue("position", "after");
        setValue("html", template.html);
        setValue("css", template.css);
        setValue("javascript", template.javascript);
        setPreviewContent({
          html: template.html,
          css: template.css,
          javascript: template.javascript,
        });
        setSelectedTemplate(templateId);
        toast.success("Template successfully loaded!");
      }
    }
  }, [searchParams, setValue]);

  // Preview içeriğini güncellemek için watch kullanımı
  useEffect(() => {
    const subscription = watch((value) => {
      setPreviewContent({
        html: value.html || "",
        css: value.css || "",
        javascript: value.javascript || "",
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleTemplateChange = (templateId: string) => {
    if (templateId) {
      const template = defaultComponents.find((c) => c.id === templateId);
      if (template) {
        setValue("name", template.name);
        setValue("selector", "");
        setValue("position", "after");
        setValue("html", template.html);
        setValue("css", template.css);
        setValue("javascript", template.javascript);
        toast.success("Template successfully loaded!");
      }
    } else {
      setValue("name", "");
      setValue("selector", "");
      setValue("position", "after");
      setValue("html", "");
      setValue("css", "");
      setValue("javascript", "");
    }
    setSelectedTemplate(templateId);
  };

  const convertTailwindToCSS = async (html: string) => {
    try {
      const result = await convertTailwindMutation.mutateAsync(html);
      setValue("css", result);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to convert TailwindCSS");
    }
  };

  const onSubmit = async (data: ComponentFormData) => {
    try {
      await createComponent.mutateAsync({
        ...data,
        css: data.css || "",
        javascript: data.javascript || "",
      });
      toast.success("Component successfully created!");
      router.push("/dashboard");
    } catch (err: any) {
      // Check for duplicate selector error
      if (err.response?.data?.code === "DUPLICATE_SELECTOR") {
        setError("selector", {
          type: "manual",
          message: err.response.data.message,
        });
        return;
      }

      toast.error(err.response?.data?.message || "Component creation failed");
    }
  };

  const templateOptions = [
    { id: "", name: "Empty Template" },
    ...defaultComponents,
  ];

  return (
    <div className="min-h-screen space-y-8">
      <h1 className="text-2xl font-bold">Default Components</h1>
      <div className="max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">New Component</h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <Select
                  label="Select Template"
                  selectedKeys={selectedTemplate ? [selectedTemplate] : []}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  {templateOptions.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  {...register("name")}
                  label="Component Name"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
                <div className="flex gap-4">
                  <Input
                    {...register("selector")}
                    label="Selector"
                    placeholder="#my-widget"
                    className="flex-1"
                    isInvalid={!!errors.selector}
                    errorMessage={errors.selector?.message}
                    description="Enter a unique CSS selector"
                  />
                  <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Position"
                        selectedKeys={[field.value]}
                        onChange={(e) =>
                          field.onChange(e.target.value as "before" | "after")
                        }
                        className="w-48"
                        isInvalid={!!errors.position}
                        errorMessage={errors.position?.message}
                      >
                        <SelectItem key="before" value="before">
                          Before
                        </SelectItem>
                        <SelectItem key="after" value="after">
                          After
                        </SelectItem>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">HTML</label>
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
                  <Controller
                    name="html"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Editor
                          height="200px"
                          defaultLanguage="html"
                          value={field.value}
                          onChange={(value) => field.onChange(value || "")}
                          options={{
                            minimap: { enabled: false },
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">CSS</label>
                  <Controller
                    name="css"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        height="200px"
                        defaultLanguage="css"
                        value={field.value}
                        onChange={(value) => field.onChange(value || "")}
                        options={{
                          minimap: { enabled: false },
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">JavaScript</label>
                  <Controller
                    name="javascript"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        height="200px"
                        defaultLanguage="javascript"
                        value={field.value}
                        onChange={(value) => field.onChange(value || "")}
                        options={{
                          minimap: { enabled: false },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={createComponent.isPending}
                  >
                    Create Component
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
                <Preview html={previewContent.html} css={previewContent.css} javascript={previewContent.javascript} />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewComponent() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardBody>
            <p className="text-center">Loading...</p>
          </CardBody>
        </Card>
      }
    >
      <NewComponentForm />
    </Suspense>
  );
}
