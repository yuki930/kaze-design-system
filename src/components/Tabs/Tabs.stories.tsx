import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { TabGroup, Tabs, Tab, TabPanel } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("overview");
    const tabs = [
      { id: "overview", label: "オーバービュー" },
      { id: "analysis", label: "分析" },
      { id: "settings", label: "設定" },
    ];
    return (
      <TabGroup value={value} onValueChange={setValue}>
        <Tabs {...args}>
          {tabs.map((tab) => (
            <Tab key={tab.id} value={tab.id}>
              {tab.label}
            </Tab>
          ))}
        </Tabs>
        {tabs.map((tab) => (
          <TabPanel key={tab.id} value={tab.id}>
            {tab.label}の内容
          </TabPanel>
        ))}
      </TabGroup>
    );
  },
};

export const Pills: Story = {
  render: (args) => {
    const [value, setValue] = useState("1m");
    const tabs = [
      { id: "1m", label: "1M" },
      { id: "3m", label: "3M" },
      { id: "6m", label: "6M" },
      { id: "1y", label: "1Y" },
    ];
    return (
      <TabGroup value={value} onValueChange={setValue}>
        <Tabs {...args} variant="pills">
          {tabs.map((tab) => (
            <Tab key={tab.id} value={tab.id}>
              {tab.label}
            </Tab>
          ))}
        </Tabs>
      </TabGroup>
    );
  },
};
