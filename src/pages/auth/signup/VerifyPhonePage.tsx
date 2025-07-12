import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { safeBack } from "@/utils/safeBack";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";

const VerifyPhonePage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/signup")}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitle title="하이" />
      </div>
    </div>
  );
};

export default VerifyPhonePage;
