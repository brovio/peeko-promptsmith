import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatPrompting() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">What ya prompting for? 🤔</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn the basics of effective prompting</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Start with clear, specific instructions</li>
              <li>Break down complex tasks into smaller steps</li>
              <li>Provide context and examples when needed</li>
              <li>Use consistent formatting and structure</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>Tips for better results</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be explicit about your expectations</li>
              <li>Include relevant constraints or limitations</li>
              <li>Review and iterate on your prompts</li>
              <li>Keep track of successful prompt patterns</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Pitfalls</CardTitle>
            <CardDescription>What to avoid</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vague or ambiguous instructions</li>
              <li>Assuming context that isn't provided</li>
              <li>Overcomplicating prompts</li>
              <li>Ignoring model limitations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Techniques</CardTitle>
            <CardDescription>Level up your prompting</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chain prompts for complex tasks</li>
              <li>Use role-based prompting</li>
              <li>Implement few-shot learning</li>
              <li>Leverage system prompts effectively</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}