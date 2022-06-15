import { GetStaticProps, NextPage } from 'next';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const fetchPlanets = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

const Planets: NextPage = () => {
  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    'planets',
    ({ pageParam = 'https://swapi.dev/api/planets/' }: any) =>
      fetchPlanets(pageParam),
    {
      getPreviousPageParam: (firstPage) => firstPage.previous ?? undefined,
      getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    }
  );

  console.log(data);

  const shouldFetchNext = (limit = 2) => {
    if (data && data.pages.length < limit) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (inView) {
      shouldFetchNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div>
      <h1>Infinite Loading</h1>
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {(error as any).message}</span>
      ) : (
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage || isFetchingPreviousPage}
            >
              {isFetchingPreviousPage
                ? 'Loading more...'
                : hasPreviousPage
                ? 'Load Older'
                : 'Nothing more to load'}
            </button>
          </div>
          {data?.pages.map((pageData: any) => (
            <div key={pageData.next}>
              {pageData.results.map((planet: any) => (
                <div key={planet.name} className="p-20 border shadow-sm m-4">
                  <div>{planet.name}</div>
                  <div>Next: {pageData.next}</div>
                </div>
              ))}
            </div>
          ))}
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load Newer'
                : 'Nothing more to load'}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? 'Background Updating...'
              : null}
          </div>
        </>
      )}
    </div>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const planets = await fetchPlanets();
//   return { props: { planets } };
// };

export default Planets;
