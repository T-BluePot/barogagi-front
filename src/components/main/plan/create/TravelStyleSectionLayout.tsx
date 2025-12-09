import { PageTitle } from "@/components/auth/common/PageTitle";

interface LayoutProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

const TravelStyleSectionLayout = ({
  title,
  subTitle,
  children,
}: LayoutProps) => {
  const sectionClass = "flex flex-col";
  return (
    <div className={sectionClass}>
      <PageTitle type="main" title={title} subTitle={subTitle} />
      <div className="flex">{children}</div>
    </div>
  );
};

export default TravelStyleSectionLayout;
