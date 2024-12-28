import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const parameters = [
  {
    name: "Context Length",
    description: "Maximum number of tokens the model can process in a single request",
    field: "context_length"
  },
  {
    name: "Input Price",
    description: "Cost per million tokens for input/prompt",
    field: "input_price"
  },
  {
    name: "Output Price",
    description: "Cost per million tokens for output/completion",
    field: "output_price"
  },
  {
    name: "Max Tokens",
    description: "Maximum number of tokens the model can generate in a response",
    field: "max_tokens"
  }
];

export function ModelParametersModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Model Parameters</DialogTitle>
          <DialogDescription>
            Available parameters from the OpenRouter API for each model
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((param) => (
              <TableRow key={param.field}>
                <TableCell className="font-medium">{param.name}</TableCell>
                <TableCell>{param.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}