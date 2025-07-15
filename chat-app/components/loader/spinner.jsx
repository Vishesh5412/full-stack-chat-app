import { ClipLoader } from "react-spinners";
import useLoaderStore from "../../store/loaderStore";
export default function Loader() {
  const { isLoading } = useLoaderStore();
  return (
    <>
      {isLoading && (
        <div className="h-full w-full flex justify-center items-center z-[9999] absolute top-0 bg-white/10 backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
}
