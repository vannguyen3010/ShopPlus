using AutoMapper;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.ViewModels;
using System.Linq;

namespace ThreeF_WebPortal.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Address
            CreateMap<M_Country, VM_SelectDropDown>();
            CreateMap<M_Province, VM_SelectDropDown>();
            CreateMap<M_District, VM_SelectDropDown>();
            CreateMap<M_Ward, VM_SelectDropDown>();
            #endregion

            #region DeliveryAddress
            CreateMap<M_DeliveryAddress, EM_DeliveryAddress>()
                .ForMember(destination => destination.countryId,
                options => options.MapFrom(source => source.countryObj.id))
                .ForMember(destination => destination.provinceId,
                options => options.MapFrom(source => source.provinceObj.id))
                .ForMember(destination => destination.districtId,
                options => options.MapFrom(source => source.districtObj.id))
                .ForMember(destination => destination.wardId,
                options => options.MapFrom(source => source.wardObj.id));
            CreateMap<M_DeliveryAddress, VM_DeliveryAddress>()
                .ForMember(destination => destination.provinceName,
                options => options.MapFrom(source => source.provinceObj.name))
                .ForMember(destination => destination.districtName,
                options => options.MapFrom(source => source.districtObj.name))
                .ForMember(destination => destination.wardName,
                options => options.MapFrom(source => source.wardObj.name));
            #endregion

            #region Supplier
            CreateMap<M_Supplier, VM_Supplier>()
              .ForMember(destination => destination.url,
              options => options.MapFrom(source => source.supplierConfigureObj.domainName))
              .ForMember(destination => destination.countryName,
              options => options.MapFrom(source => source.addressObj.countryObj.name))
              .ForMember(destination => destination.provinceName,
              options => options.MapFrom(source => source.addressObj.provinceObj.name))
              .ForMember(destination => destination.districtName,
              options => options.MapFrom(source => source.addressObj.districtObj.name))
              .ForMember(destination => destination.wardName,
              options => options.MapFrom(source => source.addressObj.wardObj.name))
              .ForMember(destination => destination.addressNumber,
              options => options.MapFrom(source => source.addressObj.addressNumber))
              .ForMember(destination => destination.addressText,
              options => options.MapFrom(source => source.addressObj.addressText))
              .ForMember(destination => destination.latitude,
              options => options.MapFrom(source => source.addressObj.latitude))
              .ForMember(destination => destination.longitude,
              options => options.MapFrom(source => source.addressObj.longitude))
              .ForMember(destination => destination.imageLogo,
              options => options.MapFrom(source => source.imageObj.mediumUrl))
              .ForMember(destination => destination.imageFavicon,
              options => options.MapFrom(source => source.imageFavicon));
            #endregion

            #region Banner
            CreateMap<M_Banner, VM_Banner>()
               .ForMember(destination => destination.imageUrl,
               options => options.MapFrom(source => source.imageObj.mediumUrl));
            #endregion

            //#region Product
            //CreateMap<M_Product, VM_ProductList>()
            //  .ForMember(destination => destination.productPriceObjs,
            //  options => options.MapFrom(source => source.productPriceObjs))
            //   .ForMember(destination => destination.categoryName,
            //  options => options.MapFrom(source => source.categoryObj.name))
            //  .ForMember(destination => destination.imageUrl,
            //  options => options.MapFrom(source => source.imageObj.smallUrl));
            //CreateMap<M_Product, VM_ProductDetail>()
            //   .ForMember(destination => destination.tradeMarkId,
            //   options => options.MapFrom(source => source.trademarkObj.id))
            //   .ForMember(destination => destination.tradeMarkName,
            //   options => options.MapFrom(source => source.trademarkObj.name))
            //   .ForMember(destination => destination.categoryId,
            //   options => options.MapFrom(source => source.categoryObj.id))
            //   .ForMember(destination => destination.categoryParentId,
            //   options => options.MapFrom(source => source.categoryObj.parentId))
            //   .ForMember(destination => destination.categoryParentName,
            //   options => options.MapFrom(source => source.categoryObj.parentObj.name))
            //   .ForMember(destination => destination.categoryName,
            //   options => options.MapFrom(source => source.categoryObj.name));
            //#endregion

            #region Order
            CreateMap<M_Order, VM_CheckoutCreateOrder>()
                .ForMember(destination => destination.supplierId,
                options => options.MapFrom(source => Lib.Encryptor.Encrypt(source.supplierId.Value.ToString())));
            CreateMap<M_OrderGetList, VM_OrderList>()
                .ForMember(destination => destination.orderItem,
                options => options.MapFrom(source => source.orderItemObjs))
                .ForMember(destination => destination.processStatus,
                options => options.MapFrom(source => source.orderProcessObj.processStatus));
            CreateMap<M_OrderItem, VM_OrderItem>()
                .ForMember(destination => destination.productId,
                options => options.MapFrom(source => source.productObj.id))
                .ForMember(destination => destination.productName,
                options => options.MapFrom(source => source.productObj.name))
                .ForMember(destination => destination.productNameSlug,
                options => options.MapFrom(source => source.productObj.nameSlug))
                .ForMember(destination => destination.productImage,
                options => options.MapFrom(source => source.imageObj.smallUrl))
                .ForMember(destination => destination.typeName,
                options => options.MapFrom(source => source.productPriceObj.typeName))
                .ForMember(destination => destination.colorName,
                options => options.MapFrom(source => source.typeColorObj.id == 0 ? "" : source.typeColorObj.name))
                .ForMember(destination => destination.sizeName,
                options => options.MapFrom(source => source.typeSizeObj.id == 0 ? "" : source.typeSizeObj.name))
                .ForMember(destination => destination.reasonName,
                options => options.MapFrom(source => source.reasonObj.name))
                .ForMember(destination => destination.reasonDescription,
                options => options.MapFrom(source => source.remark))
                .ForMember(destination => destination.reasonType,
                options => options.MapFrom(source => source.reasonObj.type));
            CreateMap<M_OrderDetail, VM_OrderView>()
                .ForMember(destination => destination.shopId,
                options => options.MapFrom(source => Lib.Encryptor.Encrypt(source.supplierObj.id.Value.ToString())))
                .ForMember(destination => destination.shopName,
                options => options.MapFrom(source => source.supplierObj.name))
                .ForMember(destination => destination.shopUrl,
                options => options.MapFrom(source => $"https://{source.supplierConfigureObj.domainName}"))
                .ForMember(destination => destination.paymentMethodId,
                options => options.MapFrom(source => source.paymentObj.id))
                .ForMember(destination => destination.paymentMethodName,
                options => options.MapFrom(source => source.paymentObj.name))
                .ForMember(destination => destination.shipMethodName,
                options => options.MapFrom(source => source.shipmethodObj.name))
                .ForMember(destination => destination.reasonName,
                options => options.MapFrom(source => source.orderProcessObj.reasonObj.name))
                .ForMember(destination => destination.reasonType,
                options => options.MapFrom(source => source.orderProcessObj.reasonObj.type))
                .ForMember(destination => destination.reasonDescription,
                options => options.MapFrom(source => source.orderProcessObj.remark))
                .ForMember(destination => destination.orderItem,
                options => options.MapFrom(source => source.orderItemObj))
                .ForMember(destination => destination.processStatus,
                options => options.MapFrom(source => source.orderProcessObj.processStatus))
                .ForMember(destination => destination.doneAt,
                options => options.MapFrom(source => source.orderProcessObj.createdAt));
            #endregion

            #region Person
            CreateMap<M_Person, EM_Person>()
               .ForMember(destination => destination.imageUrl,
               options => options.MapFrom(source => source.imageObj.mediumUrl));
            #endregion

            #region Category
            CreateMap<M_Category, VM_Menu.Category>()
               .ForMember(destination => destination.imageUrl,
               options => options.MapFrom(source => source.imageObj.mediumUrl));
            #endregion

            #region NewsCategory
            CreateMap<M_NewsCategory, VM_Menu.NewsCategory>();
            #endregion

            #region Checkout
            CreateMap<M_ShoppingCart.M_SplitShoppingCartCustom, VM_ShoppingCart.M_ProductItem>()
               .ForMember(destination => destination.cartId,
               options => options.MapFrom(source => source.id))
               .ForMember(destination => destination.id,
               options => options.MapFrom(source => source.productId))
               .ForMember(destination => destination.name,
               options => options.MapFrom(source => source.productObj.name))
               .ForMember(destination => destination.nameSlug,
               options => options.MapFrom(source => source.productObj.nameSlug))
               .ForMember(destination => destination.imageUrl,
               options => options.MapFrom(source => source.imageObj.mediumUrl))
               .ForMember(destination => destination.quantity,
               options => options.MapFrom(source => source.quantity))
               .ForMember(destination => destination.productPriceIsWarehouse,
               options => options.MapFrom(source => source.productPriceObj.isWarehouse))
               .ForMember(destination => destination.productPriceQuantity,
               options => options.MapFrom(source => source.productPriceObj.quantity))
               .ForMember(destination => destination.price,
               options => options.MapFrom(source => source.productPriceObj.priceOut))
               .ForMember(destination => destination.weight,
               options => options.MapFrom(source => source.productPriceObj.weight))
               .ForMember(destination => destination.discount,
               options => options.MapFrom(source => source.productPriceObj.discount))
               .ForMember(destination => destination.typeName,
               options => options.MapFrom(source => source.productPriceObj.typeName))
               .ForMember(destination => destination.productPriceStatus,
               options => options.MapFrom(source => source.productPriceObj.status));
               //.ForMember(destination => destination.unitName,
               //options => options.MapFrom(source => source.productPriceObj.unitObj.name))
               //.ForMember(destination => destination.sizeName,
               //options => options.MapFrom(source => source.typeSizeId != 0 ? source.typeSizeObj.name : ""))
               //.ForMember(destination => destination.colorName,
               //options => options.MapFrom(source => source.typeColorId != 0 ? source.typeColorObj.name : ""));
            CreateMap<M_ShoppingCart.M_ShoppingCartItemCustom, VM_ShoppingCart>()
               .ForMember(destination => destination.id,
               options => options.MapFrom(source => Lib.Encryptor.Encrypt(source.supplierObj.id.ToString())))
               .ForMember(destination => destination.shopName,
               options => options.MapFrom(source => source.supplierObj.name))
               .ForMember(destination => destination.shopUrl,
               options => options.MapFrom(source => $"https://{source.supplierConfigureObj.domainName}"));
            #endregion

            #region Bank
            CreateMap<M_BankPerson, VM_BankPersonSupplier>()
               .ForMember(destination => destination.number,
               options => options.MapFrom(source => source.number))
               .ForMember(destination => destination.bankName,
               options => options.MapFrom(source => source.bankObj.name))
               .ForMember(destination => destination.bankTradeName,
               options => options.MapFrom(source => source.bankObj.tradeName))
               .ForMember(destination => destination.personName,
               options => options.MapFrom(source => source.nameCard));
            CreateMap<M_BankSupplier, VM_BankPersonSupplier>()
               .ForMember(destination => destination.number,
               options => options.MapFrom(source => source.number))
               .ForMember(destination => destination.bankName,
               options => options.MapFrom(source => source.bankObj.name))
               .ForMember(destination => destination.bankTradeName,
               options => options.MapFrom(source => source.bankObj.tradeName))
               .ForMember(destination => destination.personName,
               options => options.MapFrom(source => source.nameCard));
            #endregion
        }
    }
}
