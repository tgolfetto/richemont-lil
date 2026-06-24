const courseMockImages = [
  "/course-mocks/luxury-01.svg",
  "/course-mocks/luxury-02.svg",
  "/course-mocks/luxury-03.svg",
  "/course-mocks/luxury-04.svg",
  "/course-mocks/luxury-05.svg",
  "/course-mocks/luxury-06.svg",
  "/course-mocks/luxury-07.svg",
  "/course-mocks/luxury-08.svg"
];

export function getCourseMockImage(courseId: string) {
  const hash = Array.from(courseId).reduce((total, char) => total + char.charCodeAt(0), 0);
  return courseMockImages[hash % courseMockImages.length];
}
