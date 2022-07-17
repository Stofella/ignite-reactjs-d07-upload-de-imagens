import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface GetImagesResponse {
  data: Image[];
  after?: number;
}

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = 0 }) => {
    const response = await api.get<GetImagesResponse>('/api/images', {
      params: {
        after: pageParam
      }
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images', fetchImages, {
      getNextPageParam: (lastPage, _) => lastPage.after
    }
  );

  const formattedData = useMemo(() => data?.pages.map(page => page.data).flat(), [data]);

  if (isLoading)
    return (<Loading />);

  if (isError)
    return (<Error />);

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {
          hasNextPage &&
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            { !isFetchingNextPage ? 'Carregar mais' : 'Carregando...' }
          </Button>
        }
      </Box>
    </>
  );
}
