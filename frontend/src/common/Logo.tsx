import { FaChessRook } from "react-icons/fa6";

interface Props {
  className?: string;
}

export default function Logo({ className = "" }: Props) {
  return (
    <div>
      <FaChessRook className={"text-accent my-2 " + className} />
    </div>
  );
}
