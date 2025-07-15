import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import ChatContainer from "./ChatContainer";
import useChatStore from "../store/useChatStore";
import ChatSkeleton from './Skeleton/ChatSkeleton'


export default function ChatBox() {
  const { isChatLoaded } = useChatStore();



  

  return (
    <div className=" flex flex-col w-full h-full bg-[var(--dusty-bg)] relative overflow-hidden">
      { isChatLoaded ? (
        <ChatSkeleton />
      ) : (
        <>
          <ChatHeader />
          <ChatContainer />
          <MessageInput />
        </>
      )}
    </div>
  );
}
