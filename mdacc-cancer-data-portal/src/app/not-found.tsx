import { EmptyStatePanel } from "@/components/ui/empty-state-panel";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl">
      <EmptyStatePanel
        title="Record not found"
        description="The requested page does not match any record in the current processed seed data."
        actionHref="/explore"
        actionLabel="Return to Explore"
      />
    </div>
  );
}
