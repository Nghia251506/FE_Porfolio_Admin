import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchProjectsAction,
  deleteProjectAction,
  createProjectAction,
  updateProjectAction,
  fetchProjectDetailAction,
} from "../../store/slice/projectSlice";
import { fetchTechStacksAction } from "../../store/slice/techStackSlice";
import { uploadFileAction } from "../../store/slice/mediaSlice";
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  Github,
  X,
  Loader2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { ProjectRequest, ProjectResponse } from "../../type/project";
import { useForm, useFieldArray } from "react-hook-form";

export default function ProjectManager() {
  const dispatch = useDispatch<AppDispatch>();

  const { items: projects, isLoading } = useSelector(
    (state: RootState) => state.project,
  );
  const { items: techStacks } = useSelector(
    (state: RootState) => state.techStack,
  );
  const { isUploading } = useSelector((state: RootState) => state.media);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ĐẢM BẢO REGISTER CÁC TRƯỜNG ẨN
  const { register, handleSubmit, reset, setValue, watch, control } =
    useForm<ProjectRequest>({
      defaultValues: {
        published: true,
        thumbnail: "",
        mediaList: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mediaList",
  });

  const thumbnailPreview = watch("thumbnail");
  const mediaListWatch = watch("mediaList") || [];

  useEffect(() => {
    dispatch(fetchProjectsAction(true));
    dispatch(fetchTechStacksAction());
  }, [dispatch]);

  // FIX 1: Upload Thumbnail phải đảm bảo setValue và trigger re-render
  const handleUploadThumbnail = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const resultAction = await dispatch(
      uploadFileAction({ file, folder: "projects/thumbnails" }),
    );
    if (uploadFileAction.fulfilled.match(resultAction)) {
      // Đặt giá trị và thông báo cho hook form biết là đã thay đổi
      setValue("thumbnail", resultAction.payload, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleUploadGallery = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith("video/");
      const resultAction = await dispatch(
        uploadFileAction({ file, folder: "projects/gallery" }),
      );
      if (uploadFileAction.fulfilled.match(resultAction)) {
        append({
          mediaUrl: resultAction.payload,
          mediaType: isVideo ? "VIDEO" : "IMAGE",
          isThumbnail: false,
        });
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    reset({
      title: "",
      slug: "",
      shortDescription: "",
      content: "",
      published: true,
      techStackIds: [],
      mediaList: [],
      thumbnail: "",
      sortOrder: 0,
      githubUrl: "",
      demoUrl: "",
    });
    setIsModalOpen(true);
  };

  // FIX 2: Map dữ liệu khi Edit cực kỳ quan trọng
  const handleOpenEdit = async (id: number) => {
    // 1. Mở modal và set ID ngay để người dùng thấy UI đang load
    setEditingId(id);
    setIsModalOpen(true);

    // 2. Gọi API lấy chi tiết project
    const resultAction = await dispatch(fetchProjectDetailAction(id));

    if (fetchProjectDetailAction.fulfilled.match(resultAction)) {
      const project: ProjectResponse = resultAction.payload;
      
      // 3. Xử lý techStackIds: Chuyển toàn bộ sang String để tự động tích checkbox
      const selectedTechIds = project.techStacks?.map((t) => t.id.toString()) || [];

      // 4. Fill dữ liệu vào form
      reset({
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        content: project.content,
        thumbnail: project.thumbnail,
        sortOrder: project.sortOrder,
        published: project.published,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        techStackIds: selectedTechIds as unknown as number[],
        mediaList: project.mediaList?.map((m) => ({
          mediaUrl: m.mediaUrl,
          mediaType: m.mediaType,
          thumbnail: m.thumbnail, // Kiểm tra lại field name m.thumbnail hay m.isThumbnail tùy BE
        })) || [],
      });
    } else {
      // Xử lý nếu lỗi fetch detail
      console.error("Failed to fetch project details");
      setIsModalOpen(false);
    }
  };

  const onSubmit = async (data: ProjectRequest) => {
    // Ép kiểu dữ liệu nếu cần (ví dụ isPublished từ chuỗi sang boolean nếu dùng select)
    const payload = {
      ...data,
      isPublished: String(data.published) === "true",
    };

    if (editingId) {
      await dispatch(updateProjectAction({ id: editingId, data: payload }));
    } else {
      await dispatch(createProjectAction(payload));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Project Portfolio
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your masterpieces 🚀
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* RENDER LOGIC */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-500">Fetching projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-20 text-center">
          <AlertCircle className="text-gray-300 mx-auto mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-800">
            No projects found!
          </h2>
          <button
            onClick={handleOpenAdd}
            className="mt-4 text-blue-600 font-bold"
          >
            Add your first project now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="h-52 relative bg-gray-200">
                <img
                  src={project.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black text-white ${project.published ? "bg-green-500" : "bg-gray-400"}`}
                >
                  {project.published ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-1 my-3">
                  {project.techStacks?.map((t) => (
                    <span
                      key={t.id}
                      className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4 border-t pt-4">
                  <button
                    onClick={() => handleOpenEdit(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteProjectAction(project.id))}
                    className="p-2 text-red-500 border border-red-50 rounded-xl hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-black text-gray-800 uppercase">
                {editingId ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 overflow-y-auto max-h-[85vh] grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* CỘT TRÁI: INFO */}
              <div className="md:col-span-7 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-black uppercase text-gray-400">
                      Project Title
                    </label>
                    <input
                      {...register("title", { required: true })}
                      className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400">
                      Slug
                    </label>
                    <input
                      {...register("slug", { required: true })}
                      className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400">
                      Order
                    </label>
                    <input
                      type="number"
                      {...register("sortOrder")}
                      className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400">
                      Github
                    </label>
                    <input
                      {...register("githubUrl", { required: false })}
                      className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400">
                      Domain
                    </label>
                    <input
                      type="text"
                      {...register("demoUrl")}
                      className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* FIX 3: Thêm nút isPublished chuyên nghiệp */}
                <div className="p-4 bg-blue-50/50 rounded-2xl flex items-center justify-between border border-blue-100">
                  <div>
                    <p className="text-sm font-black text-blue-900 uppercase">
                      Trạng thái hiển thị
                    </p>
                    <p className="text-xs text-blue-600 font-medium italic">
                      Cho phép người dùng thấy dự án này
                    </p>
                  </div>
                  <select
                    {...register("published")}
                    className="p-2.5 rounded-xl border-none font-bold text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Hiện (Published)</option>
                    <option value="false">Ẩn (Draft)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400">
                    Description
                  </label>
                  <textarea
                    {...register("shortDescription")}
                    rows={3}
                    className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-gray-400">
                    Content
                  </label>
                  <textarea
                    {...register("content")}
                    rows={3}
                    className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                  {techStacks.map((tech) => (
                    <label
                      key={tech.id}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-transparent hover:border-blue-200 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        // Quan trọng: Phải chuyển id sang String nếu mảng techStackIds chứa string
                        value={tech.id.toString()}
                        {...register("techStackIds")}
                        className="rounded text-blue-600"
                      />
                      <span className="text-xs font-bold text-gray-600">
                        {tech.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* CỘT PHẢI: MEDIA */}
              <div className="md:col-span-5 space-y-6 border-l pl-6">
                <div>
                  <label className="text-xs font-black uppercase text-gray-400">
                    Main Thumbnail
                  </label>
                  {/* Trường ẩn để lưu URL thumbnail vào form data */}
                  <input
                    type="hidden"
                    {...register("thumbnail", { required: true })}
                  />

                  <div className="mt-2 aspect-video bg-gray-100 rounded-2xl relative border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                    {thumbnailPreview ? (
                      <>
                        <img
                          src={thumbnailPreview}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Upload className="text-white" size={24} />
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto text-gray-300" size={32} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          Upload Thumbnail
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleUploadThumbnail}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400 flex justify-between">
                    Gallery <span>({fields.length})</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative aspect-video bg-black rounded-xl overflow-hidden group border border-gray-100"
                      >
                        {mediaListWatch[index]?.mediaType === "VIDEO" ? (
                          <video
                            src={mediaListWatch[index].mediaUrl}
                            className="w-full h-full object-cover opacity-60"
                          />
                        ) : (
                          <img
                            src={mediaListWatch[index].mediaUrl}
                            className="w-full h-full object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            fields.forEach((_, i) =>
                              setValue(`mediaList.${i}.thumbnail`, false),
                            );
                            setValue(`mediaList.${index}.thumbnail`, true);
                          }}
                          className={`absolute top-2 left-2 p-1.5 rounded-full transition-all ${mediaListWatch[index]?.thumbnail ? "bg-yellow-400 text-white" : "bg-black/40 text-white/50 hover:bg-black/60"}`}
                        >
                          <Star
                            size={12}
                            fill={
                              mediaListWatch[index]?.thumbnail
                                ? "white"
                                : "none"
                            }
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    <label className="aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
                      {isUploading ? (
                        <Loader2 className="animate-spin text-blue-500" />
                      ) : (
                        <Plus className="text-gray-300" size={24} />
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        hidden
                        onChange={handleUploadGallery}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="md:col-span-12 flex gap-4 pt-6 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 disabled:bg-blue-300 transition-all active:scale-95"
                >
                  {editingId ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
