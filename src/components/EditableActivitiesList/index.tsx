"use client";

import { Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import TextField from "../TextField";
import Button from "../Button";
import { TimeTrackActivity } from "@prisma/client";

interface Props<T> extends HTMLAttributes<HTMLElement> {
  label?: string;
  value: T[];
  setValue: Dispatch<SetStateAction<T[]>>;
}

const EditableActivitiesList: React.FC<
  Props<TimeTrackActivity & { added?: boolean; deleted?: boolean }>
> = ({ className, label, value, setValue, ...props }) => {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setValue((v) => [
        ...v,
        {
          description: newItem,
          added: true,
          id: -1,
          timeTrackId: -1,
        },
      ]);

      setNewItem("");
    }
  };

  const editItem = (index: number, newValue: string) => {
    if (newValue.trim()) {
      setValue((oldActivities) =>
        oldActivities.map((activity, i) =>
          index === i
            ? {
                ...activity,
                description: newValue,
              }
            : activity
        )
      );
    }
  };

  const deleteItem = (index: number) => {
    setValue((oldActivities) =>
      oldActivities.map((activity, i) => ({
        ...activity,
        deleted: activity.deleted || i === index,
      }))
    );
  };

  const unDeleteItem = (index: number) => {
    setValue((oldActivities) =>
      oldActivities.map((activity, i) => ({
        ...activity,
        deleted: activity.deleted && i !== index,
      }))
    );
  };

  return (
    <div className="flex-1">
      {label}
      {label && ":"}
      <div className={[className, "flex flex-col"].join(" ")} {...props}>
        <div className="flex flex-col">
          {value.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 gap-2"
            >
              <p>-</p>
              <div className="flex-grow relative">
                <TextField
                  value={item.description}
                  setValue={(newValue) => editItem(i, newValue)}
                  disabled={item.deleted}
                />
                {item.deleted && (
                  <div className="transition-opacity absolute left-[5px] top-1/2 h-[2px] bg-gray-500 w-[calc(100%-10px)]" />
                )}
              </div>

              <Button
                type="button"
                onClick={() => (item.deleted ? unDeleteItem(i) : deleteItem(i))}
                className={[
                  "!w-[48px] !h-[48px]",
                  item.deleted ? "bg-green" : "bg-red-600 text-white",
                ].join(" ")}
              >
                {item.deleted ? "+" : "x"}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p>Neue Tätigkeit:</p>
          <div className="flex items-center gap-2">
            <p>-</p>
            <TextField
              value={newItem}
              setValue={setNewItem}
              onKeyUp={(e) => {
                if (e.code === "ArrowDown") {
                  addItem();
                }
              }}
            />
            <Button
              type="button"
              onClick={addItem}
              className="bg-green !w-[48px] !h-[48px]"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableActivitiesList;
