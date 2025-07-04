import { useNavigate } from "react-router-dom";
import { TitleHeader } from "@/components/common/headers/TitleHeader";

type Props = {};

const TermsPage = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div className="w-screen bg-amber-100">
      <TitleHeader label="네" />
      <span>gkdl</span>
    </div>
  );
};

export default TermsPage;
