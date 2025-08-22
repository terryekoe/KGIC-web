import * as React from "react"
import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  setValue: (v: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue: string
}

function Tabs({ defaultValue, className, children, ...props }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props} />
  )
}

type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

function TabsTrigger({ className, value, ...props }: TriggerProps) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) return null
  const active = ctx.value === value
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active ? "bg-background text-foreground shadow-sm" : "",
        className
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    />
  )
}

type ContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
}

function TabsContent({ className, value, ...props }: ContentProps) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) return null
  if (ctx.value !== value) return null
  return (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props} />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }