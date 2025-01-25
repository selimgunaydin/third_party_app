import { useMutation } from '@tanstack/react-query';
import { convertTailwind } from '@/lib/api';

export const useConvertTailwind = () => {
  return useMutation({
    mutationFn: (html: string) => convertTailwind.convert(html),
  });
}; 