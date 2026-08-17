import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChild } from "../../../api/child";


export function useDeleteChild() {
  const qc = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteChild,
    onSuccess: (_, deletedID) => {
      qc.invalidateQueries({ queryKey: ["kare", "childs"] });
      qc.invalidateQueries({ queryKey: ["kare", "childs", deletedID] });
    },
  });
}
