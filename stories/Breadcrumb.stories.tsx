import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "@cosmo/renderer-web";
import type { Breadcrumb as BreadcrumbType } from "@cosmo/core-schema";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    onNavigate: { action: "navigate" },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const baseBreadcrumb: BreadcrumbType = {
  id: "breadcrumb-1",
  items: [
    { id: "home", label: "Home", path: "/" },
    { id: "settings", label: "Settings", path: "/settings" },
    { id: "account", label: "Account", path: "/settings/account" },
  ],
  variant: "default",
};

export const Default: Story = {
  args: {
    breadcrumb: baseBreadcrumb,
  },
};

export const TwoLevels: Story = {
  args: {
    breadcrumb: {
      ...baseBreadcrumb,
      items: [
        { id: "home", label: "Home", path: "/" },
        { id: "profile", label: "Profile", path: "/profile" },
      ],
    },
  },
};

export const FourLevels: Story = {
  args: {
    breadcrumb: {
      ...baseBreadcrumb,
      items: [
        { id: "home", label: "Home", path: "/" },
        { id: "products", label: "Products", path: "/products" },
        { id: "electronics", label: "Electronics", path: "/products/electronics" },
        { id: "phones", label: "Phones", path: "/products/electronics/phones" },
      ],
    },
  },
};

export const WithIcons: Story = {
  args: {
    breadcrumb: {
      ...baseBreadcrumb,
      items: [
        { id: "home", label: "Home", path: "/", icon: "home" },
        { id: "settings", label: "Settings", path: "/settings", icon: "settings" },
        { id: "account", label: "Account", path: "/settings/account", icon: "user" },
      ],
    },
  },
};

export const CompactVariant: Story = {
  args: {
    breadcrumb: { ...baseBreadcrumb, variant: "compact" },
  },
};

export const PillVariant: Story = {
  args: {
    breadcrumb: { ...baseBreadcrumb, variant: "pill" },
  },
};

export const SingleItem: Story = {
  args: {
    breadcrumb: {
      ...baseBreadcrumb,
      items: [{ id: "home", label: "Home", path: "/" }],
    },
  },
};

export const LongLabels: Story = {
  args: {
    breadcrumb: {
      ...baseBreadcrumb,
      items: [
        { id: "home", label: "Home", path: "/" },
        { id: "cat", label: "Category With A Very Long Name", path: "/category" },
        { id: "sub", label: "Subcategory Also Long", path: "/category/sub" },
      ],
    },
  },
};

export const WithSeparator: Story = {
  args: {
    breadcrumb: {
      ...baseBreadcrumb,
      separator: "arrow",
    },
  },
};

export const SlashSeparator: Story = {
  args: {
    breadcrumb: {
      ...baseBreadcrumb,
      separator: "slash",
    },
  },
};
