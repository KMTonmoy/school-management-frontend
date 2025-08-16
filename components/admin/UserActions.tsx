import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DeleteDialog } from "./DeleteDialog";

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserActions = ({ user, onEdit, onDelete }: UserActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onEdit(user)}
      >
        <FaEdit className="mr-1" /> Edit
      </Button>
      <DeleteDialog user={user} onDelete={onDelete} />
    </div>
  );
};