import type { ReactNode, PropsWithChildren } from "react";

interface IListHeaderProps {
  title: ReactNode;
}

export const ListHeader = (props: IListHeaderProps) => {
  return (
    <header className="px-4 py-4 flex justify-center font-bold uppercase text-xl">
      {props.title}
    </header>
  );
};

interface IListProps {
  list: Stock[];
  theme: {
    bg: string;
    text: string;
  };
}

export default function List(props: PropsWithChildren<IListProps>) {
  const list = props.list.map((stock: Stock) => (
    <li key={stock.T} className="px-4 py-2 font-bold flex justify-between">
      <span>{stock.T}</span>{" "}
      <span>{Number(stock.change).toFixed(2) + "%"}</span>
    </li>
  ));

  return (
    <>
      <ul className={`${props.theme.bg} ${props.theme.text} sm:shadow-md`}>
        <ListHeader title={props.children} />
        {list}
      </ul>
    </>
  );
}
