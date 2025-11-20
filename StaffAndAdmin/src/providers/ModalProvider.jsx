import CreateStationModal from "@/components/admin/CreateStationModal";
import { useModalStore } from "@/store/modalStore";



export default function ModalProvider() {
  const { modal, close } = useModalStore();

  return (
    <>
      <CreateStationModal
        open={modal === "createStation"} 
        onOpenChange={close}
      />
    </>
  );
}
