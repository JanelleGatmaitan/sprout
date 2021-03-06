import React from 'react';
import {
  HStack,
  Heading,
  Image,
  Text,
  Box,
  Link,
  IconButton
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

function SavedPlant(props) {
  const { plantId, name, dateAdded } = props.plant;
  return (
    <>
      <Box
        bgColor="gray"
        width="350px"
        height="220px"
        mx="20px"
        mt="15px"
        rounded="6px"
        onClick={e => {
          if (!e.target.getAttribute('plantid')) {
            window.location.hash = `#plants?plantId=${plantId}`;
          }
        }}
        _hover={{ transform: 'scale(1.1)' }}
        transition="all .2s ease-in-out"
        cursor="pointer"
      >
        <HStack
        justifyContent="flex-end"
        mr="9px"
        mt="9px"
        >
          <IconButton
            bgColor="lightRed"
            _hover={{ bgColor: 'darkRed' }}
            plantid={plantId}
            onClick={props.delete}
            borderRadius="6px"
            w={5}
            h={6}
            icon={<CloseIcon w={3} h={3} plantid={plantId}/>}
          />
        </HStack>
        <HStack>
          <Image
            src={`/images/${name.replace(' ', '_').toLowerCase()}.jpg`}
            alt="vegetable"
            boxSize="150px"
            objectFit="cover"
            mx="20px"
          />
          <Box>
            <Link
            href={`#plants?plantId=${plantId}`}
            rel="detail view"
            >
              <Heading
                fontSize="16px"
                mb="10px"
              >
                {name}
              </Heading>
            </Link>
            <Text>{`Date added: ${dateAdded}`}</Text>
          </Box>
        </HStack>
      </Box>
    < />
  );
}
export default SavedPlant;
