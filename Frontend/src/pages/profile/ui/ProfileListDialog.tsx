import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Link } from "react-router-dom";
import { ProfileUser } from "../../../data/UserProfileModel";

type ProfileListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  profiles: ProfileUser[];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function ProfileListDialog({
  open,
  onOpenChange,
  title,
  description,
  profiles,
}: ProfileListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {profiles.length > 0 ? (
            profiles.map((profileItem) => (
              <Link
                key={profileItem.id}
                to={`/users/${profileItem.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={profileItem.profile_image || ""}
                    alt={profileItem.name}
                  />
                  <AvatarFallback>{getInitials(profileItem.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{profileItem.name}</p>
                    <Badge variant="outline" className="capitalize">
                      {profileItem.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {profileItem.location || profileItem.email}
                  </p>
                  {profileItem.bio ? (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {profileItem.bio}
                    </p>
                  ) : null}
                </div>
                <Badge variant="secondary">View Profile</Badge>
              </Link>
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No profiles found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
