import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import BoardContext from "../../components/Board/context";
import { Container, Label } from "./styles";

function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(BoardContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "CARD", index, listIndex},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [_, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      console.log(data);
      const draggedListIndex = item.listIndex;

      const targertList = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      if (draggedIndex === targetIndex && draggedListIndex === targertList) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move(draggedListIndex, targertList, draggedIndex, targetIndex);
      item.index = targetIndex;
      item.listIndex = targertList;
    },
  });

  dragRef(dropRef(ref));

  return (
    <Container isDragging={isDragging} ref={ref}>
      <header>
        {data.labels.map((label) => (
          <Label key={label} color={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="avatar" />}
    </Container>
  );
}

export default Card;
