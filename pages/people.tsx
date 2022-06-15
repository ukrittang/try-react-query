import { GetStaticProps } from 'next';
import { useQuery } from 'react-query';

const fetchPeople = async () => {
  const res = await fetch('https://swapi.dev/api/people/');
  return res.json();
};

const People = ({ people }: any) => {
  const { data, status } = useQuery('planets', fetchPeople, {
    initialData: people,
  });

  return (
    <div className="p-10">
      <h1 className=" text-2xl mb-4">People</h1>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>Error fetching data!</div>}
      {status === 'success' &&
        data.results.map((people: any) => (
          <div key={people.name} className="p-20 border shadow-sm m-4">
            {people.name}
          </div>
        ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const people = await fetchPeople();
  return { props: { people } };
};

export default People;
