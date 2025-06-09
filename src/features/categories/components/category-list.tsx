"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryType } from "@/types/category";
import { MoreVertical, Pencil, RefreshCcw, Search, Trash2 } from "lucide-react";
import EditCategoryModal from "./edit-category-modal";
import { useEffect, useState } from "react";
import DeleteCategoryModal from "./delete-category-modal";
import RestoreCategoryModal from "./restore-category-modal";

interface CategoryListProps {
  categories: CategoryType[];
}

const CategoryList = ({ categories }: CategoryListProps) => {
  // Modal state
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isRestoreModal, setIsRestoreModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("all");
  const [filteredCategories, setFilteredCategories] =
    useState<CategoryType[]>(categories);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let result = [...categories];
    if (activeTab === "active") {
      result = result.filter((c) => c.status === "Active");
    } else if (activeTab === "inactive") {
      result = result.filter((c) => c.status === "Inactive");
    }

    if (searchTerm) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(result);
  }, [categories, activeTab, searchTerm]);

  const handleTabActive = async (value: string) => {
    setActiveTab(value);
  };

  const handleEditClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsEditModal(true);
  };

  const handleDeleteClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsDeleteModal(true);
  };

  const handleRestoreClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsRestoreModal(true);
  };

  const handleSearchTerm = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">ລາຍການໝວດໝູ່</CardTitle>

          <Tabs value={activeTab} onValueChange={handleTabActive}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">ທັງໝົດ</TabsTrigger>
              <TabsTrigger value="active">ກຳລັງໃຊ້ງານ</TabsTrigger>
              <TabsTrigger value="inactive">ບໍ່ໃຊ້ແລ້ວ</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-2 top-2.5 text-muted-foreground"
              />
              <Input
                placeholder="ຄົ້ນຫາໝວດໝູ່....."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchTerm}
              />
            </div>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">
              <div className="col-span-1 hidden sm:block">ລຳດັບ</div>
              <div className="col-span-6 sm:col-span-5">ໝວດໝູ່</div>
              <div className="col-span-2 text-center hidden sm:block">
                ສິນຄ້າ
              </div>
              <div className="col-span-3 sm:col-span-2 text-center">ສະຖານະ</div>
              <div className="col-span-3 sm:col-span-2 text-right">
                ອັອບຊັ່ນ
              </div>
            </div>
          </div>
          <ScrollArea className="h-[350px] sm:h-[420px]">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-3 px-2 sm:px-4 border-b items-center hover:bg-gray-50 transition-colors duration-100 text-sm"
                >
                  <div className="col-span-1 hidden sm:block">
                    {" "}
                    {index + 1}{" "}
                  </div>
                  <div className="col-span-6 sm:col-span-5 truncate pr-2">
                    {" "}
                    {category.name}{" "}
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    {" "}
                    0{" "}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-center">
                    <Badge
                      variant={
                        category.status == "Active" ? "default" : "destructive"
                      }
                      className="p-1 sm:p-2"
                    >
                      {category.status === "Active"
                        ? "ກຳລັງໃຊ້ງານ"
                        : "ບໍ່ໄດ້ໃຊ້ງານ"}
                    </Badge>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right">
                    {/* mobile action button */}
                    <div className="flex justify-end gap-1 md:hidden">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="size-7"
                        onClick={() => handleEditClick(category)}
                      >
                        <Pencil size={15} />
                      </Button>
                      {category.status === "Active" ? (
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="size-7"
                          onClick={() => handleDeleteClick(category)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      ) : (
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="size-7"
                          onClick={() => handleRestoreClick(category)}
                        >
                          <RefreshCcw size={15} />
                        </Button>
                      )}
                    </div>

                    {/* Desktop Action Button */}
                    <div className="hidden md:block">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="size-8"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleEditClick(category)}
                          >
                            <Pencil size={15} />
                            <span>ແກ້ໄຂ</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {category.status === "Active" ? (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleDeleteClick(category)}
                            >
                              <Trash2 size={15} className="text-destructive" />
                              <span className="text-destructive">ລົບ</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleRestoreClick(category)}
                            >
                              <RefreshCcw
                                size={15}
                                className="text-orange-500"
                              />
                              <span className="text-orange-500">ກູ້ຄືນ</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                ບໍ່ພົບໝວດໝູ່
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <EditCategoryModal
        open={isEditModal}
        onOpenChange={setIsEditModal}
        category={selectedCategory}
      />
      <DeleteCategoryModal
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
        category={selectedCategory}
      />
      <RestoreCategoryModal
        open={isRestoreModal}
        onOpenChange={setIsRestoreModal}
        category={selectedCategory}
      />
    </>
  );
};

export default CategoryList;
