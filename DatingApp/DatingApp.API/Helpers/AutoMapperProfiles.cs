using AutoMapper;
using DatingApp.API.Controllers;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using System.Linq;

namespace DatingApp.API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<User, UserForListDtos>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            })
            .ForMember(dest => dest.Age, opt =>
            {
                opt.MapFrom(d => d.DateOfBirth.CalculateAge());
            });

        CreateMap<User, UserForDetailedDtos>()
         .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            })
            .ForMember(dest => dest.Age, opt =>
            {
                opt.MapFrom(d => d.DateOfBirth.CalculateAge());
            });

        CreateMap<Photo, PhotosForDetailedDto>();

        CreateMap<UserForUpdateDTO, User>();

        CreateMap<PhotoForCreationDTO, Photo>();
        CreateMap<Photo, PhotoForReturnDto>();
        CreateMap<UserForRegisterDto, User>();
    }
}