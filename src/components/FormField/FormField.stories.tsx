import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { FormField } from "./FormField";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";

const meta = {
  title: "Components/FormField",
  component: FormField,
  args: {
    label: "ラベル",
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "名前",
  },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="山田太郎" />
    </FormField>
  ),
};

export const WithDescription: Story = {
  args: {
    label: "メールアドレス",
    description: "確認メールを送信します。正しいアドレスを入力してください。",
  },
  render: (args) => (
    <FormField {...args}>
      <Input type="email" placeholder="example@email.com" />
    </FormField>
  ),
};

export const WithError: Story = {
  args: {
    label: "メールアドレス",
    error: "有効なメールアドレスを入力してください。",
  },
  render: (args) => (
    <FormField {...args}>
      <Input defaultValue="invalid-email" />
    </FormField>
  ),
};

export const Required: Story = {
  args: {
    label: "会社名",
    required: true,
  },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="株式会社サンプル" />
    </FormField>
  ),
};

export const WithCharacterCounter: Story = {
  render: () => {
    const Component = () => {
      const [value, setValue] = useState("");
      return (
        <FormField
          label="お問い合わせ内容"
          maxLength={200}
          currentLength={value.length}
        >
          <Textarea
            placeholder="お問い合わせ内容をご記入ください"
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </FormField>
      );
    };
    return <Component />;
  },
};

export const CompleteForm: Story = {
  render: () => {
    const Component = () => {
      const [message, setMessage] = useState("お世話になっております。");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "28rem" }}>
          <FormField label="名前" required>
            <Input placeholder="山田太郎" defaultValue="山田太郎" />
          </FormField>

          <FormField
            label="メールアドレス"
            required
            error="有効なメールアドレスを入力してください。"
          >
            <Input type="email" defaultValue="yamada@" />
          </FormField>

          <FormField label="お問い合わせ種別">
            <Select defaultValue="general">
              <option value="general">一般的なお問い合わせ</option>
              <option value="support">技術サポート</option>
              <option value="billing">お支払いについて</option>
            </Select>
          </FormField>

          <FormField
            label="お問い合わせ内容"
            required
            description="できるだけ具体的にご記入ください。"
            maxLength={500}
            currentLength={message.length}
          >
            <Textarea
              placeholder="お問い合わせ内容をご記入ください"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FormField>
        </div>
      );
    };
    return <Component />;
  },
};
