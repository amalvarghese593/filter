import React, { useRef } from "react";
import { useTagsInput } from "../hooks/useTagsInput";
import "./index.css";

export const TagChipInputNew = ({
  error,
  value: tags = [],
  setTags = () => {},
  tagsLimit = 6,
  placeholder = "Enter",
  isTagsInside = true,
  isDefaultUi = false,
  onBlur = () => {},
  onChange = () => {},
  onKeyDown = () => {},
  onHandleShow = () => {},
  label,
  component: Component,
}) => {
  const tagsInputCntrRef = useRef();
  const inputRef = useRef();
  const { DefaultUi } = useTagsInput(tags, setTags, onChange, undefined, error);
  //usetags called twice
  const {
    removeItem,
    addItem,
    getCurrentItem,
    currentIndex,
    setCurrentIndex,
    currentTag,
    isShowTags,
    setIsShowTags,
  } = useTagsInput(tags, setTags, onChange, tagsInputCntrRef);
  const handleClick = (e) => {
    onHandleShow(e);
    setIsShowTags((prev) => !prev);
    inputRef.current?.focus();
    setCurrentIndex(undefined);
  };
  const hasComponent = Component?.hasOwnProperty("CloseButton");
  const handleKeyDown = (e) => {
    addItem(e, tagsLimit);
    onKeyDown(e);
  };
  const handleChange = (e) => {
    getCurrentItem(e);
  };
  return (
    <>
      {isDefaultUi ? (
        DefaultUi(placeholder, isTagsInside, tagsLimit)
      ) : (
        <div ref={tagsInputCntrRef}>
          {label && <label>{label}</label>}
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="tag-item"
              data-hidden={
                !isShowTags && tags.length - idx > tagsLimit ? "hide" : ""
              }
              //array should be sliced to improve dom
            >
              {tag}
              <span>
                {hasComponent ? (
                  <Component.CloseButton onClick={() => removeItem(tag)} />
                ) : (
                  <span onClick={() => removeItem(tag)}>x</span>
                )}
              </span>
            </span>
          ))}
          {tags.length > tagsLimit && (
            <button onClick={handleClick}>
              Show {!isShowTags ? "more" : "less"}...
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={currentTag}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
          />
          {error && !tags.length && (
            <span className="field-error">{error}</span>
          )}
        </div>
      )}
    </>
  );
};
