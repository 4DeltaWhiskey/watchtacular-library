interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`category-button ${
            activeCategory === category ? "active" : ""
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;