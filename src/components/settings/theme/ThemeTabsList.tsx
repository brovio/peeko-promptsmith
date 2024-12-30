import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ThemeTabsList() {
  return (
    <TabsList className="flex flex-wrap gap-1 bg-background p-1">
      <TabsTrigger value="all">All Elements</TabsTrigger>
      <TabsTrigger value="base">Base Colors</TabsTrigger>
      <TabsTrigger value="buttons">Buttons</TabsTrigger>
      <TabsTrigger value="cards">Cards</TabsTrigger>
      <TabsTrigger value="inputs">Input Fields</TabsTrigger>
      <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
      <TabsTrigger value="search">Search</TabsTrigger>
      <TabsTrigger value="icons">Icons</TabsTrigger>
      <TabsTrigger value="dividers">Dividers</TabsTrigger>
    </TabsList>
  );
}