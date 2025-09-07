import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/Models/product';
import { MatCard } from '@angular/material/card'
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialogModule } from '@angular/material/dialog'
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { shopParams } from '../../shared/Models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/Models/pagination';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-shop',
  imports: [
    MatCard,
    MatDialogModule,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {


  products?: Pagination<Product>
 
  sortOptions = [
    {name:'Alphabetical', value:'name'},
     {name:'Price Low-High', value:'priceAsc'},
      {name:'Price High-Low', value:'priceDesc'}
  ]

  shopParams = new shopParams

  pageSizeOptions=[5,10,15,20]


  constructor(private shopService: ShopService, public dialogService: MatDialog) { }

  ngOnInit(): void {
    this.initializeShop()
  }

  initializeShop() {
    this.shopService.getBrands()
    this.shopService.getTypes()
    this.getProducts()
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams)
    .subscribe((res)=>{
      this.products=res
      console.log("prdocus",this.products);
      
    })
  }

  handlePageEvent(event:PageEvent){
    this.shopParams.pageNumber=event.pageIndex +1
    this.shopParams.pageSize=event.pageSize
    this.getProducts()
  }

  onSearchChange(){
    this.shopParams.pageNumber=1;
    this.getProducts()
  }

  openFiltersDialog() {
    const dialoRef = this.dialogService.open(FiltersDialogComponent,
      {
        minWidth: '500px',
        data:{
          selectedBrands:this.shopParams.brands,
          selectedTypes:this.shopParams.types
        }
      });
      dialoRef.afterClosed().subscribe((res)=>{
        if(res){
          this.shopParams.brands=res.selectedBrands,
          this.shopParams.types=res.selectedTypes
          this.shopParams.pageNumber = 1//ippo last pageil annel and avdanne filter use akyal frst pageil thanne vann nikkennam
          this.getProducts()
        }
      })
  }


  onSortChange(event:MatSelectionListChange){
    const selectedOption = event.options[0]
    if(selectedOption){
      this.shopParams.sort=selectedOption.value
      this.shopParams.pageNumber = 1//ippo last pageil annel and avdanne filter use akyal frst pageil thanne vann nikkennam
      this.getProducts()
      
    }
  }




}
