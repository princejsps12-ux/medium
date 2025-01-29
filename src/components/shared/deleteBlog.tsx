"use client";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function DeleteBlog({ params }: { params: { id: string } }) {
  const router = useRouter();
  const blogId = params.id || "";
  const queryClinet = useQueryClient();
  const session = useSession();
  const authorId = session.data?.user?.id;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const deleteBlogResponse = await axios.delete(
        `/api/deleteBlog/${blogId}`
      );
      return deleteBlogResponse.data.response;
    },
    onSuccess: () => {
      queryClinet.invalidateQueries({ queryKey: ["myBlogs", authorId] });
      toast({
        title: "Blog deleted successfully",
        description: "Blog has been deleted successfully",
        variant: "default",
        className: " text-white bg-blue-950 hover:bg-black",
      });
      router.push("/userBlogs");
    },
    onError: (error: AxiosError) => {
      //    const axiosError= error as AxiosError;
      //    if( axiosError.response?.status ==400){
      //     toast({

      //     })
      //    }
      if (error?.response?.status == 400) {
        toast({
          title: "Blog to be deleted not found",
          description:
            "There was somehting wrong with the request or the blog doesnt exist",
          variant: "destructive",
          className: " text-white bg-blue-950 hover:bg-black",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete blog",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="">
      <Button onClick={()=>deleteMutation.mutate()} className="bg-blue-950 hover:bg-black" disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? <Loader2 className="animate-spin scroll-smooth"/> : <Trash2/>}
    </Button>
    </div>
  );
}
