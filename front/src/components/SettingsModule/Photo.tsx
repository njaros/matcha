import { useEffect, useRef, useState } from "react";
import { IPhoto } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { Box, Button, Image, List, ListItem, Input, Flex, Text, Stack, SimpleGrid, IconButton, Icon } from "@chakra-ui/react";
import ReturnButton from "./ReturnButton";
import { CiCirclePlus } from "react-icons/ci";
import { FaCrown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";
import { RiDeleteBin5Fill } from "react-icons/ri";




const Photo = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [accepted, setAccepted] = useState<string[]>([]);
    const [denied, setDenied] = useState<{"filename": string, "reason": string}[]>([]);
    const [errorMsg, setErrorMsg] = useState<{"section": string, "message": string}>({"section": "", "message": ""});
    const [photos, setPhotos] = useState<IPhoto[]>([]);
    const [onMount, setOnMount] = useState<boolean>(true);
    const [boolReactBug, setBoolReactBug] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) 
            return;
        uploadFiles(files);
      };
    
      const uploadFiles = (files: FileList) => {
        if (photos.length >= 5){
            console.error("You cannot have more than 5 photos")
        }
        const form = new FormData();
        form.append("file[]", files[0]);
        
        Axios.post("profile/upload", form, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
          .then(response => {
            setAccepted(response.data.accepted);
            setDenied(response.data.denied);
          })
          .catch(error => {
            console.error(error);
          });
      };
    
      const handlePhotoClick = () => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      };
    

    function getPhotos()
    {
        Axios.get("profile/get_photos").then(
            response => {
                let newPhotos: IPhoto[] = [];
                response.data.photos.map((photo: any) => {
                    newPhotos.push({
                        "id": photo.id,
                        "htmlSrcImg": "data:".concat(photo.mimetype)
                        .concat(";base64,")
                        .concat(photo.binaries),
                        "main": photo.main
                })
            })
            setPhotos(newPhotos.sort((a, b) => {
                if (a.main == true)
                    return -1;
                if (b.main == true)
                    return 1;
                return 0;
            }));
        }
        ).catch(
            error => {
                if (error.response.data.message != undefined)
                    setErrorMsg({   "section": "photos", 
                                    "message": error.response.data.message});
                else
                    setErrorMsg({   "section": "photos",
                                    "message": "unhandled error "
                                                    .concat(error.response.status.toString())});
                console.warn(error);
            }
        )
    }

    useEffect(() => {
        if (onMount == true)
        {
            getPhotos();
            setOnMount(false);
        }
        else
        {
            if (accepted.length >= 1)
            {
                getPhotos();
            }
        }
    }, [accepted])

    

    const delPhotoHandler = (e: any) => {
        const form = new FormData();
        const photoId = e;
        setAccepted([]);
        setDenied([]);
        form.append("photo_id", photoId);
        Axios.post("profile/delete_photo", form)
        .then(response => {
            const newPhotos = photos.filter(
                photo => photo.id != photoId);
            if (response.data.mainId != "")
            {
                newPhotos.forEach(
                    photo => {
                        if (photo.id == response.data.mainId)
                        photo.main = true;
                });
                newPhotos.sort((a, b) => {
                    if (a.main == true)
                        return -1;
                    if (b.main == true)
                        return 1;
                    return 0;
                });
            }
            setPhotos(newPhotos);
        })
        .catch(error => {
            console.warn(error);
        });
    }

    const changeMainPhotoHandler = (e:any) => {
        const form = new FormData();
        const photoId = e;
        form.append("photo_id", photoId);
        Axios.post("profile/change_main_photo", form)
        .then(response => {
            const newPhotos = photos;
            newPhotos.forEach(photo => {
                if (photo.main == true)
                photo.main = false;
                if (photo.id == photoId)
                photo.main = true;
            })
            newPhotos.sort((a, b) => {
                if (a.main == true)
                    return -1;
                if (b.main == true)
                    return 1;
                return 0;
            });
            setPhotos(newPhotos);
            setBoolReactBug(!boolReactBug);
        })
        .catch(error => {
            console.warn(error);
        })
        setAccepted([]);
        setDenied([]);
    }

    const BoxPhoto = (props : {photo: any, main: boolean}) => {
        return (
            <Flex flexDirection={'column'}>
                <Box 
                    bg="#edf2f7" 
                    h="300px" 
                    w="170px" 
                    borderRadius={'15px'} 
                    border={'1px'} 
                    borderColor={'grey'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    onClick={handlePhotoClick}
                >

                    {props.photo ? (
                    <>
                        <Image 
                            src={props.photo.htmlSrcImg} 
                            alt="Photo" 
                            objectFit="cover" 
                            borderRadius="15px"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%" 
                        />
                    </>
                    ) : (
                    <>
                        <Input
                            type="file"
                            accept="image/"
                            ref={inputRef}
                            style={{ display: "none" }}
                            onChange={onChangeFile}
                        />
                        <Icon
                            as={CiCirclePlus}
                            boxSize={'35px'}
                        />
                    </>
                    
                    )}
                    
                </Box>
                <Flex 
                    justifyContent={'center'} 
                    marginTop={'5px'}
                    gap={'8px'}
                >
                    {props.photo ? 
                        <Icon
                            as={RiDeleteBin5Fill} 
                            onClick={() => delPhotoHandler(props.photo.id)}/> 
                        : 
                        <Flex marginBottom={'16px'}/>
                    }
                    {props.photo && 
                        <>
                            {props.main ?  <Icon
                                color={'gold'}
                                as={RiVipCrownFill} 
                            />
                            :
                            <Icon
                                as={RiVipCrownFill} 
                                onClick={() => changeMainPhotoHandler(props.photo.id)}
                            />
                            }
                        </> 
                        
                    }
                </Flex>
            </Flex>
        )
    }

    return (
        <Flex
            flexDirection={'column'}
            w={'100%'}
            h={'100%'}
            alignItems={'center'}
            overflow={'hidden'}
        >
             <Flex 
                flexDirection={'row'}
                paddingLeft={'20px'}
                marginTop={'10px'}
                marginBottom={'10px'}
                placeSelf={'flex-start'}
            >
                <Box alignSelf={'center'}>
                    <ReturnButton to="/settings"/>
                </Box>
                <Text
                    fontSize={'xx-large'}
                    alignSelf={'center'}
                    margin={'0px 5px'}
                    fontWeight={'bold'}
                    paddingLeft={'5px'}
                    textColor={'black'}
                >
                    Photos
                </Text>
            </Flex>
            <SimpleGrid
                columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
                spacing={3}
                w="100%"
                h="100%"
                alignItems="center"
                justifyItems="center"
                overflowY={'auto'}
                marginTop={'15px'}
                padding={'0px 10px'}
            >
                <BoxPhoto photo={photos[0]} main={true}/>                    
                <BoxPhoto photo={photos[1]} main={false}/>                    
                <BoxPhoto photo={photos[2]} main={false}/>                    
                <BoxPhoto photo={photos[3]} main={false}/>
                <BoxPhoto photo={photos[4]} main={false}/>                                      

            </SimpleGrid>
   
        </Flex>
    )
}

export default Photo;     