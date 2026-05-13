import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";
import { use } from "react";

export const revalidate = 3;

export const generateMetadata = () =>
  buildTaskMetadata("sbm", {
    path: "/sbm",
    title: taskPageMetadata.sbm.title,
    description: taskPageMetadata.sbm.description,
  });

export default function SocialBookmarkingPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  return <TaskListPage task="sbm" category={resolvedSearchParams?.category} />;
}
