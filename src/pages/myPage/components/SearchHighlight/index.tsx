import { brightenKeyWord } from '@/util';
import { Input } from 'antd';
import { useState, useCallback } from 'react';

interface SearchHighlightProps {}

const initData = [
  { id: '1', title: '标题1' },
  { id: '2', title: '标题2' },
  { id: '3', title: '标题34' },
  { id: '4', title: '标题4' },
  { id: '5', title: '标题5标题5' },
];

function SearchHighlight(props: SearchHighlightProps) {
  const {} = props;
  const [searchValue, setSearchValue] = useState<any>();
  const [data, setData] = useState<any>(JSON.parse(JSON.stringify(initData)));

  const onSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchValue(value);
      if (value) {
        const filterData = data.filter((item: any) => item.title.indexOf(value) > -1);
        setData(filterData);
      } else {
        setData(JSON.parse(JSON.stringify(initData)));
      }
    },
    [data],
  );

  return (
    <div>
      <Input onChange={onSearch} style={{ width: 200 }} />
      <ul>
        {data.map((item: { id: string; title: string }) => (
          <li key={item.id}>
            <div
              dangerouslySetInnerHTML={{
                __html: brightenKeyWord(item.title, searchValue) || '',
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchHighlight;
