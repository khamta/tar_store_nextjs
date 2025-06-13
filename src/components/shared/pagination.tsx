'use client'

import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

interface PageginationProps {
    totalCount: number
    page: number
    limit: number
    path: string
}

const Pagination = ({ totalCount, page, limit, path}: PageginationProps) => {

      const searchParams = useSearchParams();
      const router = useRouter();
      const totalPages = Math.ceil(totalCount / limit);

    const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    router.push(`${path}?${newParams.toString()}`);
  };
  return (
    <div>
        <div className="flex justify-between items-center mt-8">
        <Button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
          ກັບຄືນ
        </Button>
        <span>
          ໜ້າ {page} ຈາກທັງໝົດ {totalPages} ໜ້າ
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          ຖັດໄປ
        </Button>
      </div>
    </div>
  )
}

export default Pagination