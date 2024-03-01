"use client";

interface IHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<IHeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2x font-bold">{title}</div>
      <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
    </div>
  );
};

export default Heading;
