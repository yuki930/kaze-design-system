import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tabs, Tab } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState("overview");
    const tabs = [
      { id: "overview", label: "オーバービュー" },
      { id: "analysis", label: "分析" },
      { id: "settings", label: "設定" },
    ];
    return (
      <Tabs {...args}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={active === tab.id}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
    );
  },
};

export const Pills: Story = {
  render: (args) => {
    const [active, setActive] = useState("1m");
    const tabs = [
      { id: "1m", label: "1M" },
      { id: "3m", label: "3M" },
      { id: "6m", label: "6M" },
      { id: "1y", label: "1Y" },
    ];
    return (
      <Tabs {...args} variant="pills">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={active === tab.id}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
    );
  },
};
