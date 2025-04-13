import { Box, Card, Image, Button } from "@chakra-ui/react";

type BookCardProps = {
  volumeInfo: {
    title?: string;
    authors?: string[];
    publisher?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  }
  isSaved?: boolean;
  onToggleSave?: () => void;
}


export default function BookCard ({ volumeInfo, isSaved, onToggleSave }: BookCardProps) {
  const { title, authors, publisher, description, imageLinks } = volumeInfo;
  const thumbnail = imageLinks?.thumbnail || imageLinks?.smallThumbnail;
  const authorsList = authors?.join(", ") || "Unknown Author";
  return (
    <Card.Root flexDirection="row" overflow="hidden" width="520px" height="200px" borderRadius="20px" mb="20px">
      {thumbnail && (
        <Box width="115px" height="100%" ml="10px" p="0px 5px" display="flex" justifyContent="center" alignItems="center" >
          <Image src={thumbnail} alt={title} objectFit="contain" width="100%" height="100%"/>
        </Box>
      )}
      <Box width="405px" >
        <Card.Body pb="0">
          <Card.Title lineClamp="1">{title}</Card.Title>
          <Card.Description lineClamp="1">{authorsList}</Card.Description>
          <Card.Description lineClamp="1">{publisher}</Card.Description>
          <Card.Description lineClamp="3">{description}</Card.Description>
        </Card.Body>
        <Card.Footer pb="5px" pt="5px">
          <Button
            height="4/5"
            onClick={onToggleSave}
            backgroundColor={isSaved ? "blue" : "red"}>
            {isSaved ? "Delete" : "Save"}
          </Button>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}
