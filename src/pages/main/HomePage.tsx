import HomeContentsSection from "@/components/main/home/HomeContentsSection";
import HomeGreetingSection from "@/components/main/home/HomeGreetingSection";

const HomePage = () => {
  return (
    <div className="flex flex-col h-full">
      <HomeGreetingSection />
      <HomeContentsSection />
    </div>
  );
};

export default HomePage;
