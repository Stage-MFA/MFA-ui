"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styles from "@/app/style/editor.module.css";

type Props = {
  value: string;
  onChange: (content: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const apiKey = process.env.NEXT_PUBLIC_TINIFY_API_KEY;

  return (
    <div className={styles.editorWrapper}>
      <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 230,
          menubar: true,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
            "link image media table | align lineheight | numlist bullist indent outdent | " +
            "emoticons charmap | removeformat",
          content_style: `
            body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#333; }
            h1, h2, h3, h4, h5, h6 { color:#1e40af; }
            a { color:#2563eb; text-decoration: underline; }
          `,
        }}
      />
    </div>
  );
}
