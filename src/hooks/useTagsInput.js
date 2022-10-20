import React, { useState, useEffect, useRef } from "react";
import { useEventListener } from "./useEventListener";
import "./index.css";

export const useTagsInput = (
  // initialTags = [],
  tags = [],
  setTags = () => {},
  onChange = () => {},
  tagsInputCntrRef,
  error = undefined
) => {
  const inputRef = useRef();
  const tagsWrapperRef = useRef();
  // const [tags, setTags] = useState(initialTags);
  const [currentTag, setCurrentTag] = useState("");
  // const tagsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState();
  const [isShowTags, setIsShowTags] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const onClickOutside = (e) => {
    const cntrRef = tagsInputCntrRef || tagsWrapperRef;
    if (!cntrRef.current?.contains(e.target)) {
      setIsShowTags(false);
    }
  };
  useEventListener(document, "click", onClickOutside);
  // useEventListener(tagsWrapperRef, "click", () =>
  //   console.log("clicked inside")
  // );

  //to prevent newly added tag from getting highlighted
  useEffect(() => {
    onChange(tags);
    if (!tags.length || currentIndex > tags.length - 1)
      setCurrentIndex(undefined);
  }, [tags]);

  const getCurrentItem = (e) => {
    setCurrentTag(e.target.value);
    if (isShowTags) {
      setIsShowTags(false);
    }
  };
  //readability needed
  const addItem = (e, tagsCountLimit) => {
    if (e.key === "Enter" && currentTag) {
      //loogic should be put outside setTags
      setTags((prev) => {
        if (currentTag.includes(",")) {
          const currentItems = currentTag.split(",");
          const arr = [];
          currentItems.forEach((el) => {
            const trimmedItem = el.trim();
            if (trimmedItem && !tags.includes(trimmedItem)) {
              arr.push(trimmedItem);
            }
          });
          return arr.length ? [...prev, ...arr] : prev;
        }
        const trimmedTag = currentTag.trim();
        return !trimmedTag || prev.includes(trimmedTag)
          ? prev
          : [...prev, trimmedTag];
      });
      setCurrentTag("");
    } else if (e.key === "Enter" && !currentTag && currentIndex !== undefined) {
      setTags((prev) => prev.filter((el, idx) => idx !== currentIndex));
    } else if (e.key === ",") {
      setTags((prev) =>
        !currentTag || prev.includes(currentTag) ? prev : [...prev, currentTag]
      );
      setTimeout(() => setCurrentTag(""), 10);
    } else if (e.key === "ArrowLeft" && !currentTag && tags.length) {
      if (isShowTags) {
        setCurrentIndex((prev) => (prev ? prev - 1 : tags.length - 1));
      } else {
        setCurrentIndex((prev) =>
          prev
            ? prev > tags.length - tagsCountLimit
              ? prev - 1
              : tags.length - 1
            : tags.length - 1
        );
      }
    } else if (e.key === "ArrowRight" && !currentTag && tags.length) {
      if (isShowTags) {
        setCurrentIndex((prev) =>
          prev !== undefined && prev < tags.length - 1 ? prev + 1 : 0
        );
      } else {
        setCurrentIndex((prev) =>
          prev !== undefined && prev < tags.length - 1
            ? prev + 1
            : tags.length - tagsCountLimit > 0
            ? tags.length - tagsCountLimit
            : 0
        );
      }
    } else if (e.key === "Escape") {
      setIsShowTags(false);
    } else if (e.key === "Backspace" && !currentTag && tags.length) {
      setTags((prev) => {
        const copy = [...prev];
        copy.pop();
        return copy;
      });
    }
  };

  const removeItem = (item) =>
    setTags((prev) => prev.filter((el) => el !== item));

  const DefaultUi = (
    placeholder = "Enter something",
    isTagsInside = false,
    tagsCountLimit = 6
  ) => (
    <div ref={tagsWrapperRef} className="d-inl-blk tags-wpr">
      <div className="tags-cntr tags-d-flex">
        {isTagsInside && (
          <Tags
            inputRef={inputRef}
            tags={tags}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            removeItem={removeItem}
            isShowTags={isShowTags}
            setIsShowTags={setIsShowTags}
            tagsCountLimit={tagsCountLimit}
          />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={currentTag}
          onChange={getCurrentItem}
          onKeyDown={(e) => addItem(e, tagsCountLimit)}
          onBlur={() => setIsTouched(true)}
          className="tag-input"
        />
      </div>
      {error && isTouched && !tags.length && (
        <span className="field-error">{error}</span>
      )}
      {!isTagsInside && (
        <div className="tags-d-flex">
          <Tags
            inputRef={inputRef}
            tags={tags}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            removeItem={removeItem}
            isShowTags={isShowTags}
            setIsShowTags={setIsShowTags}
            tagsCountLimit={tagsCountLimit}
          />
        </div>
      )}
    </div>
  );

  return {
    removeItem,
    addItem,
    getCurrentItem,
    currentIndex,
    setCurrentIndex,
    currentTag,
    // tags,
    isShowTags,
    setIsShowTags,
    DefaultUi,
  };
};

const Tags = ({
  tags,
  currentIndex,
  setCurrentIndex,
  removeItem,
  isShowTags,
  setIsShowTags,
  tagsCountLimit,
  inputRef,
}) => {
  const handleShow = () => {
    setIsShowTags((prev) => !prev);
    inputRef.current?.focus();
    setCurrentIndex(undefined);
  };
  return (
    <>
      {tags.map((el, idx) => (
        <span
          key={idx}
          className={`tag-chip ${idx === currentIndex ? "highlight" : ""}`}
          data-hidden={
            !isShowTags && tags.length - idx > tagsCountLimit ? "hide" : ""
          }
        >
          {el}
          <CloseIcon onClick={() => removeItem(el)} />
        </span>
      ))}
      {tags.length > tagsCountLimit && (
        <button onClick={handleShow}>
          Show {!isShowTags ? "more" : "less"}...
        </button>
      )}
    </>
  );
};

const CloseIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    fill="currentColor"
    className="bi bi-x-lg close"
    viewBox="0 0 16 16"
  >
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
  </svg>
);
