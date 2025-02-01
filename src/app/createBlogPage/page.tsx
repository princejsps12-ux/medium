"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import axios, {  AxiosError } from "axios";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { LuImagePlus } from "react-icons/lu";

import { blogSchema } from "@/validation/blogSchema";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/shared/ImageDropzone";

export default function CreateBlogPage() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showDropBox, setShowDropBox] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post("/api/createBlog", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
      toast({
        title: "Success",
        description: "Blog was created successfully",
      });
      router.push("/home");
    },
    onError: (error:AxiosError) => {
       const axiosError = error as AxiosError<{message:string}>;   // this was changed while build
      toast({
        title: "Error",
        description:
        axiosError.response?.data?.message ||
          "Failed to create blog. Please try again.",
        variant: "destructive",
        className: "text-white bg-blue-950 hover:bg-black",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof blogSchema>) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (uploadedImage) {
      formData.append("image", uploadedImage);
    }
    createBlogMutation.mutate(formData);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully.`,
      });
    }
  };

  const removeFile = () => {
    // setUploadedImage(null);
    // setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedImage(null);
    setPreviewUrl(null);
    toast({
      title: "File Removed",
      description: "Uploaded file has been removed.",
    });
  };

  const {} = useDropzone({  // getRootProps, getInputProps  removed while build
    onDrop,
    accept: { "image/*": [".png", ".jpeg", ".jpg", ".svg"] },
  });

  return (
    <div className="min-h-screen w-full fixed inset-0 bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-100">
            Create a New Blog Post
          </CardTitle>
          <CardDescription className="text-gray-400">
            Share your thoughts with the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the title of your blog post"
                        {...field}
                        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-white italic" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setShowDropBox(!showDropBox)}
                  className="bg-gray-700 text-gray-200"
                >
                  <LuImagePlus className="mr-2" />
                  Add Image
                </Button>
              </div>

              <div>
 
                {showDropBox && (
                  <div className="border-2 border-dashed rounded-md border-gray-700 p-4">
                    <ImageDropzone
                      onFileSelect={(file) => {
                        setUploadedImage(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }}
                      onFileRemove={() => {
                        // if (previewUrl) {
                        //   URL.revokeObjectURL(previewUrl);
                        // }
                        // setUploadedImage(null);
                        // setPreviewUrl(null);
                        removeFile();
                      }}
                    />
                  </div>
                )}
                {/*Rest of your component code here*/}
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog post content here"
                        {...field}
                        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-primary focus:ring-primary min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage className="text-white italic" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                disabled={createBlogMutation.isPending}
              >
                {createBlogMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Blog Post"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
