import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  headerTitle?: string;
  headerDescription?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  headerTitle,
  headerDescription,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[480px] relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            {subtitle}
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          {(headerTitle || headerDescription) && (
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">{headerTitle}</CardTitle>
              <CardDescription className="text-center text-gray-500">
                {headerDescription}
              </CardDescription>
            </CardHeader>
          )}
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}